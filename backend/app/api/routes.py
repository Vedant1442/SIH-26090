from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
import time

from app.core.database import get_db
from app.models import domain, schemas

router = APIRouter()

@router.get("/products", response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    products = db.query(domain.ProductModel).order_by(domain.ProductModel.id.desc()).all()
    return products

@router.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = domain.ProductModel(
        id=f"p{int(time.time() * 1000)}",
        **product.model_dump()
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/products/{product_id}/verify", response_model=schemas.Product)
def verify_product(product_id: str, db: Session = Depends(get_db)):
    db_product = db.query(domain.ProductModel).filter(domain.ProductModel.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db_product.status = "verified"
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/docs", response_model=List[schemas.DocStep])
def get_docs(db: Session = Depends(get_db)):
    docs = db.query(domain.DocStepModel).all()
    return docs

@router.put("/docs/{doc_id}", response_model=schemas.DocStep)
def update_doc_status(doc_id: str, status_update: schemas.DocStatusUpdate, db: Session = Depends(get_db)):
    db_doc = db.query(domain.DocStepModel).filter(domain.DocStepModel.id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document step not found")
    db_doc.status = status_update.status
    db.commit()
    db.refresh(db_doc)
    return db_doc
