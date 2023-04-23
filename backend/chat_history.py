import logging
from pydantic import BaseModel
from typing import List, Tuple

logger  =  logging.getLogger( __name__ )

class ChatHistory(BaseModel):
    history: List[Tuple[str, str]] = []
    
    def add_message(self, message: Tuple[str, str]):
        self.history.append(message)
        logging.info(f"Added message to chat history {message}")
        
    def get_history(self):
        return self.history