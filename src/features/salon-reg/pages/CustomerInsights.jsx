import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Button } from '../../../shared/ui/button';
import { Badge } from '../../../shared/ui/badge';
import { Star, MessageSquare, Send } from 'lucide-react';
import { ImageWithFallback } from '../../../shared/ui/ImageWithFallback';
import { useAuth } from '../../auth/auth-provider.jsx';
import { 
  getCustomerInsights, 
  getSalonReviews, 
  respondToReview, 
  sendCustomerOffer 
} from '../api.js';

export default function CustomerInsights() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadCustomerData();
    }
  }, [user?.id]);

  const loadCustomerData = async () => {
    try {
      const [insightsData, reviewsData] = await Promise.all([
        getCustomerInsights(user.id),
        getSalonReviews(user.id)
      ]);
      
      setCustomers(insightsData.customers || []);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Failed to load customer data:', error);
    }
  };

  const handleSendOffer = async (customerId) => {
    setLoading(true);
    try {
      const offer = {
        type: 'discount',
        value: 10,
        message: 'Special discount for our valued customer!'
      };
      
      await sendCustomerOffer(customerId, offer);
    } catch (error) {
      console.error('Failed to send offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToReview = async (reviewId, response) => {
    setLoading(true);
    try {
      await respondToReview(reviewId, response);
      const reviewsData = await getSalonReviews(user.id);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Failed to respond to review:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer History</CardTitle>
          <CardDescription>View customer visit histories and provide personalized service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {customers.map((customer) => (
            <Card key={customer.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p>{customer.name}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>{customer.visits} visits</span>
                      <span>•</span>
                      <span>Total: ${customer.totalSpent}</span>
                      <span>•</span>
                      <span>Last: {new Date(customer.lastVisit).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      Loves: {customer.favoriteService}
                    </Badge>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleSendOffer(customer.id)}
                    disabled={loading}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Offer
                  </Button>
                </div>

                {customer.beforeAfter && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Before</p>
                      <ImageWithFallback
                        src={customer.beforeAfter[0]}
                        alt="Before"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">After</p>
                      <ImageWithFallback
                        src={customer.beforeAfter[1]}
                        alt="After"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Reviews
          </CardTitle>
          <CardDescription>Respond to customer reviews to manage your reputation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p>{review.customerName}</p>
                    <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700">{review.comment}</p>

                {review.responded ? (
                  <div className="space-y-2">
                    <Badge className="bg-green-100 text-green-800">
                      Response sent
                    </Badge>
                    {review.response && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Your response:</p>
                        <p className="text-sm">{review.response}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(review.responseDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRespondToReview(review.id, 'Thank you for your feedback!')}
                    disabled={loading}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}