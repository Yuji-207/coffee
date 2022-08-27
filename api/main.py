from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post('/users/', response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session=Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail='Email already registered')
    return crud.create_user(db=db, user=user)


@app.get('/users/', response_model=list[schemas.User])
def read_users(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get('/users/{user_id}', response_model=schemas.User)
def read_user(id: int, db: Session=Depends(get_db)):
    db_user = crud.get_user(db, id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail='User not found')
    return db_user


@app.post('/users/{user_id}/recipes/', response_model=schemas.Recipe)
def create_recipe(user_id: int, recipe: schemas.RecipeCreate, db: Session=Depends(get_db)):
    return crud.create_recipe(db=db, recipe=recipe, user_id=user_id)


@app.get('/recipes/', response_model=list[schemas.Recipe])
def read_recipes(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    recipes = crud.get_recipes(db, skip=skip, limit=limit)
    return recipes


@app.get('/recipes/{recipe_id}', response_model=schemas.User)
def read_recipe(id: int, db: Session=Depends(get_db)):
    db_recipe = crud.get_recipe(db, id=id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail='Recipe not found')
    return db_recipe
