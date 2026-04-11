# 🎬 MovieFlix - Real-Time Recommendation System

A full-stack movie recommendation system that provides personalized suggestions using collaborative filtering based on user interactions (search & clicks).

## Features

* User Authentication (Login/Register)
* Movie Search
* Personalized Recommendations
* Trending Movies Section
* Tracks user interactions (clicks)
* Real-time recommendation updates
* Clean Netflix-style UI

## Tech Stack

### Frontend
* React.js
* CSS

### Backend
* Flask (Python)
* REST API

### Data & ML
* Collaborative Filtering
* MovieLens Dataset


##  Project Structure
```
real_time_recommendation_system/
│
├── backend/
│   ├── app.py               # Flask API
│   ├── Procfile             # Deployment config
│   ├── data/                # Dataset
│   └── model/               # ML model files
│
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Styling
│   │   └── ...
│
├── pipeline/                # Data processing / model pipeline
│
├── .gitignore
└── README.md
```

##  Installation & Setup

###  Clone the Repository

```
git clone https://github.com/sakshi1323-dev/real_time_recommendation_system.git
cd real_time_recommendation_system
```

###  Backend Setup (Flask)
```
cd backend
pip install -r requirements.txt
python app.py
```
Backend will run on:
```
http://localhost:5000
```

###  Frontend Setup (React)
```
cd frontend
npm install
npm start
```
Frontend will run on:
```
http://localhost:3000
```

## API Endpoints

| Endpoint               | Method | Description           |
| ---------------------- | ------ | --------------------- |
| `/login`               | POST   | User login            |
| `/register`            | POST   | User registration     |
| `/search/<query>`      | GET    | Search movies         |
| `/recommend/<user_id>` | GET    | Get recommendations   |
| `/trending`            | GET    | Get trending movies   |
| `/save`                | POST   | Save user interaction |


## How It Works

* Uses collaborative filtering to recommend movies
* Tracks:
  * Search history
  * Movie clicks
* Updates recommendations dynamically based on user behavior

## Deployment
You can deploy using:

* **Frontend:** Vercel 
* **Backend:** Render 

## Author
**Sakshi Shelke**
B.Tech ECE (AI/ML)


