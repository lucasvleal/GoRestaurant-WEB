import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const foodsResponse = await api.get('/foods');

      setFoods(foodsResponse.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(food: IFoodPlate): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API
      api.post('/foods', food);

      setFoods([...foods, food]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: IFoodPlate): Promise<void> {
    // TODO UPDATE A FOOD PLATE ON THE API
    const foodIndex = foods.findIndex(
      searchedFood => searchedFood.id === editingFood.id,
    );

    if (foodIndex > -1) {
      foods[foodIndex] = food;
    } else {
      alert('Não encontrado');
    }

    api.put(`/foods/${food.id}`, {
      id: food.id,
      available: food.available,
      name: food.name,
      image: food.image,
      price: food.price,
      description: food.description,
    });

    setFoods([...foods]);
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API
    api.delete(`/foods/${id}`);

    const foodIndex = foods.findIndex(searchedFood => searchedFood.id === id);

    if (foodIndex > -1) {
      foods.splice(foodIndex, 1);
    } else {
      alert('Não encontrado');
    }

    setFoods([...foods]);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
