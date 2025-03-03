# Online Geek Store

This project aims to provide a platform for purchasing various technological products conveniently online. Users can explore a wide range of products, make purchases, and utilize several key features outlined below.

## Features

### 1. Product Catalog
The most important feature of the platform is the **Product Catalog**, where customers can browse through an extensive selection of technological products. Key features include:
- **Detailed Listings**: Each product comes with a detailed description, high-quality images, technical specifications, customer reviews, and price information.
- **Product Sorting and Filtering**: Users can filter products by category (e.g., gaming, laptops, accessories), price range, ratings, and other key attributes to help find the perfect product.
- **Product Search**: A robust search engine that enables users to search for products by name, brand, or category.

### 2. Payment Options
Flexible payment methods to accommodate a variety of user preferences:
- **Cash on Delivery**:Ideal for customers who prefer physical transactions.
- **Mobile Money (Sinpe Movil)**: Pay conveniently through the **Sinpe Movil** service for a quick and secure online payment experience.
  

### 3. Weekly Sales Reports
Stay informed about the store's performance with weekly sales reports. These reports provide valuable insights into sales trends, popular products, and revenue generation. Accessible to authorized personnel for strategic decision-making.

### 4. Category Search
**Category Search** feature enables users to easily navigate and find the products they are most interested in. Categories include:
- **Entertainment** (Games, movies, gaming consoles, etc.)
- **Laptops and Computers**
- **Tech Accessories** (Headphones, chargers, keyboards, etc.)

## Installation

To set up the **Online Geek Store** project on your local machine, follow these steps:

### Prerequisites
- **Docker desktop** 
- **Node.js** (v14.0 or later)
- **SQLDB** (using Docker image)
- **npm** (Node package manager)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/online-geek-store.git

2. **Navigate to the Project Folder:**
   ```bash
   cd ....

4. **Install dependencies:**
   ```bash
   npm install

5. **Get sql image:**
   ```bash
   docker pull mysql

6. **Get sql image:**
   ```bash
   docker run mysql

7. **Configure Environment Variables:**
    ```bash
   NEXT_PUBLIC_API=http://localhost:5022
   API=http://localhost:7265

8. **Run the Development Server:**
    ```bash
   npm run dev

## WebApp Architecture

### UML Diagram
![Backend Diagram](https://raw.githubusercontent.com/jazielrs/Pagina_compra/master/backend.png)

### Package Diagram
![Package Diagram](https://raw.githubusercontent.com/jazielrs/Pagina_compra/master/package.png)

### Purchase Flow Diagram
![Backend Diagram](https://raw.githubusercontent.com/jazielrs/Pagina_compra/master/purchaseFlow.png)
