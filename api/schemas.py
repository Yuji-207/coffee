from datetime import datetime

from pydantic import BaseModel


class RecipeBase(BaseModel):
    temperature: int


class RecipeCreate(RecipeBase):
    pass


class Recipe(RecipeBase):
    id: int
    user_id: int
    created: datetime

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    recipes: list[Recipe] = []
    created: datetime
    edited: datetime

    class Config:
        orm_mode = True
