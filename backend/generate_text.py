from typing import List, Tuple
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain.schema import Document
import logging

logger = logging.getLogger(__name__)

prompt_template = """
You are an AI Model which is an expert at providing accurate answers to questions. If you do not have the confidence to answer the question, you simply say 'I do not know'.

So far, you have been asked the following questions and had these answers:
{chat_history}

Please use this context to answer the question:
{context}

Please answer the question given:
{question}

Please answer succinctly and accurately. Also, while answering, please explain using clear steps and logic. Write a synthetic bullet point list of relevant actions / plans / project features:

Lastly, please answer your question in correct html
"""

def generate_text(text: str, api_key: str, model: str, store: FAISS, memory: ConversationBufferMemory):
    # search our vector store for the most relevant documents
    vector_search = store.similarity_search_with_relevance_scores(text, k=3)
    valid_context, sources = get_valid_context(vector_search, score_threshold=0.65)
    
    chat_history = memory.load_memory_variables({"question": text})['chat_history']
        
    # create prompt 
    prompt = PromptTemplate(template=prompt_template, input_variables=["chat_history", "context", "question"])
    
    # create chain
    llm = OpenAI(model_name= model, temperature=0, openai_api_key=api_key)
    conversation = LLMChain(llm=llm, verbose=True, prompt=prompt)
    answer = conversation.predict(chat_history=chat_history, context=valid_context, question=text)
    logger.info(f"Generated Response From LLM: \n {answer}")
    memory.save_context({"input": text}, {"output": answer})

    return answer + "\n\n" + str(sources)

def generate_prompt(text: str, api_key: str, store: FAISS):
    """
    This function generates a prompt which can be copy pasted into another GPT model that is more up to date. 
    """
    vector_search = store.similarity_search_with_relevance_scores(text, k=3)
    valid_context, sources = get_valid_context(vector_search, score_threshold=0.65)
    chat_history = ""
    prompt = prompt_template.format(chat_history=chat_history, context=valid_context, question=text)
    
    logger.info(f"Generated Prompt: \n {prompt}")
    return prompt
    

def get_valid_context(context: List[Tuple[Document, float]], score_threshold: float = 0.65):
    valid_context = []
    sources = []
    
    for doc, score in context:
        if score > score_threshold:
            valid_context.append(doc.page_content)
            sources.append(str(doc.metadata['source']))
            
    return valid_context, sources

def generate_sources(text: str, store: FAISS, api_key: str, model="gpt-3.5-turbo"):
    """
    This function generates a list of sources which can be used to generate a prompt for a GPT model.
    """
    sources = []
    vector_search = store.similarity_search_with_relevance_scores(text, k=5)
    for doc, score in vector_search:
        sources.append({"source_name": str(doc.metadata['source']), 
                        "first_ten_words": str(doc.page_content).split(" ")[:10], 
                        "relevancy_score": f"{score:.2f}"})
        
    llm = OpenAI(model_name= model, temperature=0, openai_api_key=api_key)
    
    source_prompt_template = """    
    You have been provided with a dictionary of sources as delineated by three tick marks.
    ```
    {sources}
    ```
    
    Please analyze this dictionary and provide the names of the most 3 most relevant sources. You might notice 
    that the source has leading / characters for the file path, please ignore those and the characters that precede it. 
    Additionally, provide the relevancy score for each source and the first ten words of the source. Please be clear and concise. 
    Also, if the same source is repeated, do not restate the source name but you can include the words and relevancy score. 
    Do not change the formatting of the first ten words as those words will be used to search on later.
    
    Please format your answer in the style of HTML.
    """
    
    
    prompt = PromptTemplate(template=source_prompt_template, input_variables=["sources"])
    conversation = LLMChain(llm=llm, verbose=True, prompt=prompt)
    answer = conversation.predict(sources=sources)
    logger.info(f"Generated Response From gpt-3.5 LLM: \n {answer}")
    return answer

