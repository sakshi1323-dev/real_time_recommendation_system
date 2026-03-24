# Real-Time Data Pipeline + Recommendation System
## Overview
This project builds an end-to-end data system that:
- Collects and processes data using ETL pipeline
- Stores data in a database
- Uses Machine Learning to recommend movies
- Displays results via Streamlit UI
## Tech Stack
- Python
- Pandas
- Scikit-learn
- SQLite
- Streamlit
## Architecture
Raw Data → ETL Pipeline → Database → ML Model → UI
## How to Run
```bash
python pipeline/pipeline.py
streamlit run app.py