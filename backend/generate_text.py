from langchain.llms import OpenAI
from langchain.chains import VectorDBQAWithSourcesChain


def generate_text(text: str, api_key: str, model: str, store):
    llm = OpenAI(model_name= model, temperature=0, openai_api_key=api_key)
    chain = VectorDBQAWithSourcesChain.from_llm(llm=llm, vectorstore=store)
    result = chain({"question": text})
    result_text = result["answer"] + "\n\n" + result["sources"]
    return result_text

