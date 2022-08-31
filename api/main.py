# TODO: post・getの順番を入れ替える
# TODO: 複数形を_listに統一する
# TODO: パスパラメータのみuser -> idなどにする


from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas, bayse
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post('/users', response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session=Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail='Email already registered')
    return crud.create_user(db=db, user=user)


@app.get('/users', response_model=list[schemas.User])
def read_users(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get('/users/{user_id}', response_model=schemas.User)
def read_user(user_id: int, db: Session=Depends(get_db)):
    db_user = crud.get_user(db, id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail='User not found')
    return db_user


@app.get('/users/{user_id}/distributions', response_model=schemas.Distribution)
def read_user_distributions(user_id: int, db: Session=Depends(get_db)):

    # user-recipes prior distributions
    taste = bayse.create_prior()
    strength = bayse.create_prior()

    for evaluation in crud.get_evaluations(db):  # TODO: by_user=user_id
        taste = bayse.update(taste, evaluation.taste)
        strength = bayse.update(strength, evaluation.strength)

    taste, _ = bayse.create_posteriors(taste)
    strength, _ = bayse.create_posteriors(strength)

    distributions = {
        'taste': taste,
        'strength': strength
    }

    return distributions


@app.post('/beans_list', response_model=schemas.Beans)
def create_beans(beans: schemas.BeansCreate, db: Session=Depends(get_db)):
    return crud.create_beans(db=db, beans=beans)


@app.get('/beans_list', response_model=list[schemas.Beans])
def read_beans_list(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    beans_list = crud.get_beans_list(db, skip=skip, limit=limit)
    return beans_list


@app.get('/beans_list/{beans_id}', response_model=schemas.Beans)
def read_beans(beans_id: int, db: Session=Depends(get_db)):
    db_beans = crud.get_beans(db, id=beans_id)
    if db_beans is None:
        raise HTTPException(status_code=404, detail='Beans not found')
    return db_beans


@app.post('/recipes', response_model=schemas.Recipe)
def create_recipe(
        user_id: int,
        beans_id: int,
        recipe: schemas.RecipeCreate,
        db: Session=Depends(get_db),
    ):
    db_user = crud.get_user(db, id=user_id)
    if db_user is None:
        raise HTTPException(status_code=400, detail='User not found')
    db_beans = crud.get_beans(db, id=beans_id)
    if db_beans is None:
        raise HTTPException(status_code=400, detail='Beans not found')
    return crud.create_recipe(
        db=db,
        recipe=recipe,
        beans_id=beans_id,
        user_id=user_id
    )


@app.get('/recipes', response_model=list[schemas.Recipe])
def read_recipes(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    recipes = crud.get_recipes(db, skip=skip, limit=limit)
    return recipes


@app.get('/recipes/distributions', response_model=schemas.Distribution)
def read_recipe_distributions(db: Session=Depends(get_db)):

    # user-recipes prior distributions
    taste = bayse.create_prior()
    strength = bayse.create_prior()

    for evaluation in crud.get_evaluations(db):  # TODO: by_user=user_id
        taste = bayse.update(taste, evaluation.taste)
        strength = bayse.update(strength, evaluation.strength)

    _, taste = bayse.create_posteriors(taste)
    _, strength = bayse.create_posteriors(strength)

    distributions = {
        'taste': taste,
        'strength': strength
    },

    return distributions


@app.get('/recipes/{recipe_id}', response_model=schemas.Recipe)
def read_recipe(recipe_id: int, db: Session=Depends(get_db)):
    db_recipe = crud.get_recipe(db, id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=404, detail='Recipe not found')
    return db_recipe


@app.post('/evaluations', response_model=schemas.Evaluation)
def create_evaluation(
    evaluation: schemas.EvaluationCreate,
    user_id: int,
    recipe_id: int,
    db: Session=Depends(get_db),
):
    db_user = crud.get_user(db, id=user_id)
    if db_user is None:
        raise HTTPException(status_code=400, detail='User not found')
    db_recipe = crud.get_recipe(db, id=recipe_id)
    if db_recipe is None:
        raise HTTPException(status_code=400, detail='Recipe not found')
    return crud.create_evaluation(
        db=db,
        evaluation=evaluation,
        user_id=user_id,
        recipe_id=recipe_id,
    )


@app.get('/evaluations', response_model=list[schemas.Evaluation])
def read_evaluations(skip: int=0, limit: int=100, db: Session=Depends(get_db)):
    evaluations = crud.get_evaluations(db, skip=skip, limit=limit)
    return evaluations


@app.get('/evaluations/{evaluation_id}', response_model=schemas.Evaluation)
def read_evaluation(evaluation_id: int, db: Session=Depends(get_db)):
    db_evaluation = crud.get_evaluation(db, id=evaluation_id)
    if db_evaluation is None:
        raise HTTPException(status_code=404, detail='Evaluation not found')
    return db_evaluation
