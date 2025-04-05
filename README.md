# 🧠 Deepfake Detection App

A full-stack application that detects deepfakes in images using a deep learning model (EfficientNet). The **frontend** is built with **React**, and the **backend** uses **FastAPI** with a trained model.

![Project Structure](https://via.placeholder.com/500x200?text=Deepfake+Project+Structure) <!-- Add real screenshot later -->

## 📂 Project Structure
deepfake/
├── backend/ # FastAPI backend
│ ├── app/
│ │ ├── model/ # Model loading & prediction logic
│ │ ├── utils/ # Image preprocessing utilities
│ │ └── ...
│ ├── main.py # FastAPI entry point
│ └── requirements.txt
│
└── frontend/ # React frontend
├── src/
└── package.json


## 🚀 Getting Started

### Prerequisites
- Python 3.8+ (backend)
- Node.js 16+ (frontend)
- TensorFlow 2.x

### 🔧 How to Run

**Backend Setup:**
```bash
cd backend 
```
```bash
pip install -r requirements.txt
```
```bash
uvicorn main:app --reload
```
**Frontend Setup**
```bash
cd frontend
```
```bash 
npm install
```
```bash
npm run dev
```
### The backend will run at http://localhost:8000 and frontend at http://localhost:3000.