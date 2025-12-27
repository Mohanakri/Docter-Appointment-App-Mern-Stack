paymentRoutes.post('/create', authGuard(['USER']), createPayment);
paymentRoutes.post('/confirm/:id', confirmPayment);
