server.js
├── express
├── mongoose
├── cors
├── dotenv
└── routes/
    ├── auth.js
    │   ├── jwt
    │   ├── models/User
    │   └── middleware/auth
    ├── furniture.js
    │   ├── models/Furniture
    │   ├── middleware/auth
    │   └── middleware/upload
    ├── orders.js
    │   ├── models/Order
    │   ├── models/Furniture
    │   └── middleware/auth
    ├── resources.js
    │   ├── models/Resource
    │   ├── middleware/auth
    │   └── middleware/upload
    └── users.js
        ├── models/User
        └── middleware/auth

middleware/
├── auth.js
│   ├── jwt
│   └── models/User
└── upload.js
    ├── multer
    └── path

models/
├── User.js (mongoose, bcryptjs)
├── Furniture.js (mongoose)
├── Order.js (mongoose)
└── Resource.js (mongoose)