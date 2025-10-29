// User type definition
export const User = {
  id: String,
  name: String,
  email: String,
  role: String,
  // Add other user properties as needed
};

// Salon type definition
export const Salon = {
  id: String,
  name: String,
  ownerId: String,
  address: String,
  phone: String,
  description: String,
  image: String,
  rating: Number,
  reviewCount: Number,
  status: String, // 'pending', 'approved', 'rejected'
  rejectionReason: String, // Optional, only for rejected salons
};
