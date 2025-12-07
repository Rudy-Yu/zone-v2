"""
Database connection and helper functions
"""
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, Dict, Any, List
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'zone_db')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]


def convert_objectid_to_str(doc: Dict) -> Dict:
    """Convert ObjectId to string in document"""
    if doc and '_id' in doc:
        doc['id'] = str(doc['_id'])
        del doc['_id']
    return doc


async def create_document(collection_name: str, data: Dict) -> Dict:
    """Create a new document in collection"""
    collection = db[collection_name]
    data['created_at'] = datetime.utcnow()
    data['updated_at'] = datetime.utcnow()
    result = await collection.insert_one(data)
    doc = await collection.find_one({'_id': result.inserted_id})
    return convert_objectid_to_str(doc)


async def get_document(collection_name: str, doc_id: str) -> Optional[Dict]:
    """Get a document by ID"""
    collection = db[collection_name]
    try:
        doc = await collection.find_one({'_id': ObjectId(doc_id)})
        if doc:
            return convert_objectid_to_str(doc)
        return None
    except:
        # Try as string if ObjectId fails
        doc = await collection.find_one({'id': doc_id})
        if doc:
            return convert_objectid_to_str(doc)
        return None


async def get_documents(collection_name: str, filter_dict: Optional[Dict] = None, 
                       skip: int = 0, limit: int = 1000, sort: Optional[List] = None) -> List[Dict]:
    """Get multiple documents from collection"""
    collection = db[collection_name]
    filter_dict = filter_dict or {}
    cursor = collection.find(filter_dict)
    
    if sort:
        cursor = cursor.sort(sort)
    
    cursor = cursor.skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [convert_objectid_to_str(doc) for doc in docs]


async def update_document(collection_name: str, doc_id: str, data: Dict) -> Optional[Dict]:
    """Update a document"""
    collection = db[collection_name]
    data['updated_at'] = datetime.utcnow()
    
    # Remove _id from data if exists
    data.pop('_id', None)
    data.pop('id', None)
    
    try:
        result = await collection.update_one(
            {'_id': ObjectId(doc_id)},
            {'$set': data}
        )
        if result.modified_count > 0:
            return await get_document(collection_name, doc_id)
    except:
        # Try as string if ObjectId fails
        result = await collection.update_one(
            {'id': doc_id},
            {'$set': data}
        )
        if result.modified_count > 0:
            return await get_document(collection_name, doc_id)
    return None


async def delete_document(collection_name: str, doc_id: str) -> bool:
    """Delete a document"""
    collection = db[collection_name]
    try:
        result = await collection.delete_one({'_id': ObjectId(doc_id)})
        return result.deleted_count > 0
    except:
        # Try as string if ObjectId fails
        result = await collection.delete_one({'id': doc_id})
        return result.deleted_count > 0


async def count_documents(collection_name: str, filter_dict: Optional[Dict] = None) -> int:
    """Count documents in collection"""
    collection = db[collection_name]
    filter_dict = filter_dict or {}
    return await collection.count_documents(filter_dict)


async def find_one_document(collection_name: str, filter_dict: Dict) -> Optional[Dict]:
    """Find one document by filter"""
    collection = db[collection_name]
    doc = await collection.find_one(filter_dict)
    if doc:
        return convert_objectid_to_str(doc)
    return None

