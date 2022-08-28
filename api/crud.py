from datetime import datetime as dt

from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, id: int):
    return db.query(models.User).filter(models.User.id == id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int=0, limit: int=100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    created = dt.now()
    db_user = models.User(
        name=user.name,
        email=user.email,
        password=user.password,
        created=created,
        edited=created,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_beans(db: Session, id: int):
    return db.query(models.Beans).filter(models.Beans.id == id).first()

    
def get_beans_list(db: Session, skip: int=0, limit: int=100):
    return db.query(models.Beans).offset(skip).limit(limit).all()


def create_beans(db: Session, beans: schemas.BeansCreate):
    created = dt.now()
    db_beans = models.Beans(
        **beans.dict(),
        created=created,
    )
    db.add(db_beans)
    db.commit()
    db.refresh(db_beans)
    return db_beans


def get_recipe(db: Session, id: int):
    return db.query(models.Recipe).filter(models.Recipe.id == id).first()

    
def get_recipes(db: Session, skip: int=0, limit: int=100):
    return db.query(models.Recipe).offset(skip).limit(limit).all()


def create_recipe(
        db: Session,
        recipe: schemas.RecipeCreate,
        beans_id: int,
        user_id: int
    ):
    created = dt.now()
    db_recipe = models.Recipe(
        **recipe.dict(),
        beans_id=beans_id,
        user_id=user_id,
        created=created,
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe
