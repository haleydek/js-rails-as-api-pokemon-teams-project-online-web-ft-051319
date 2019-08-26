class PokemonsController < ApplicationController
    def destroy
        pokemon = Pokemon.find_by(id: params[:id])

        if pokemon
            pokemon.delete
            render json: pokemon.to_json(:only => [:id, :nickname, :species, :trainer_id])
        else
            render json: { :message => "Pokemon was not found" }
        end
    end

    def create
        trainer = Trainer.find_by(id: params[:trainer_id])

        if trainer
            if trainer.pokemons.size < 6
                new_pokemon = trainer.pokemons.create!(nickname: Faker::Name.first_name, species: Faker::Games::Pokemon.name, trainer_id: trainer.id)

                render json: new_pokemon.to_json(:only => [:nickname, :species, :trainer_id])
            else
                render json: { :message => "A team cannot have more than 6 pokemons" }
            end
        else
            render json: { :message => "Trainer was not found" }
        end
    end

    private

    def pokemon_params
        params.permit(:nickname, :species, :trainer_id)
    end
end
