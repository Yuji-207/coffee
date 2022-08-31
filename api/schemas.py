# TODO: BaseClassを廃止
# TODO: RecipeなどをRecipeReadなどに変更
# TODO: RecipeCreateにもbeans_id・user_idを追加することを検討


from datetime import datetime

from pydantic import BaseModel


class Distribution(BaseModel):
    taste: list[float]
    strength: list[float]


class EvaluationBase(BaseModel):
    taste: int
    strength: int


class EvaluationCreate(EvaluationBase):
    pass


class Evaluation(EvaluationBase):
    id: int
    user_id: int
    recipe_id: int
    created: datetime
    edited: datetime

    class Config:
        orm_mode = True


class RecipeBase(BaseModel):
    temperature: int


class RecipeCreate(RecipeBase):
    pass


class Recipe(RecipeBase):
    id: int
    beans_id: int
    user_id: int
    created: datetime

    class Config:
        orm_mode = True


class BeansBase(BaseModel):
    name: str


class BeansCreate(BeansBase):
    pass


class Beans(BeansBase):
    id: int
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
