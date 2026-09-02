from sqlalchemy import Column, Integer, String, Float, JSON
from app.core.database import Base

class ProductModel(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    nameLocal = Column(String)
    craft = Column(String)
    status = Column(String)
    priceLow = Column(Float)
    priceHigh = Column(Float)
    confidence = Column(String)
    capturedBy = Column(String)
    image = Column(String)
    materials = Column(String)
    timeHours = Column(Integer)
    exceptions = Column(JSON)

class DocStepModel(Base):
    __tablename__ = "doc_steps"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    why = Column(String)
    status = Column(String)
