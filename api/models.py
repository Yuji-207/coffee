from sqlalchemy import Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created = Column(DateTime)
    edited = Column(DateTime)

    recipes = relationship('Recipe', back_populates='creator')


class Beans(Base):
    __tablename__ = 'beans'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created = Column(DateTime)

    recipes = relationship('Recipe', back_populates='beans')


class Recipe(Base):
    __tablename__ = 'recipes'

    id = Column(Integer, primary_key=True, index=True)
    beans_id = Column(Integer, ForeignKey('beans.id'))
    temperature = Column(Integer)
    user_id = Column(Integer, ForeignKey('users.id'))
    created = Column(DateTime)

    beans = relationship('Beans', back_populates='recipes')
    creator = relationship('User', back_populates='recipes')
