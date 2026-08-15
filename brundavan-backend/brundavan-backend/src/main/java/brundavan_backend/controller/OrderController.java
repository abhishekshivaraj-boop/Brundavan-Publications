package brundavan_backend.controller;

import brundavan_backend.entity.Book;
import brundavan_backend.entity.Order;
import brundavan_backend.entity.OrderItem;
import brundavan_backend.repository.BookRepository;
import brundavan_backend.repository.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
        origins = {
                "http://localhost:5174",
                "http://localhost:5175"
        }
)
public class OrderController {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;

    public OrderController(
            OrderRepository orderRepository,
            BookRepository bookRepository
    ) {
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
    }

    // =========================
    // CREATE ORDER
    // =========================

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody Order order
    ) {

        if (order.getOrderItems() == null ||
                order.getOrderItems().isEmpty()) {

            return ResponseEntity.badRequest().build();
        }

        for (OrderItem item : order.getOrderItems()) {

            if (item.getBook() == null ||
                    item.getBook().getId() == null) {

                return ResponseEntity.badRequest().build();
            }

            Book book = bookRepository
                    .findById(item.getBook().getId())
                    .orElse(null);

            if (book == null) {
                return ResponseEntity.badRequest().build();
            }

            item.setBook(book);
            item.setOrder(order);
        }

        if (order.getPaymentMethod() == null) {
            order.setPaymentMethod("UPI");
        }

        if (order.getPaymentStatus() == null) {
            order.setPaymentStatus(
                    Order.PaymentStatus.PENDING
            );
        }

        if (order.getOrderStatus() == null) {
            order.setOrderStatus(
                    Order.OrderStatus.PLACED
            );
        }

        Order savedOrder =
                orderRepository.save(order);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedOrder);
    }

    // =========================
    // GET ALL ORDERS
    // =========================

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {

        List<Order> orders =
                orderRepository.findAll();

        return ResponseEntity.ok(orders);
    }

    // =========================
    // UPDATE PAYMENT STATUS
    // =========================

    @PutMapping("/{id}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {

        Order order = orderRepository
                .findById(id)
                .orElse(null);

        if (order == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Order not found.");
        }

        String status =
                body.get("status");

        if (status == null || status.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("Payment status is required.");
        }

        try {
            Order.PaymentStatus paymentStatus =
                    Order.PaymentStatus.valueOf(
                            status.toUpperCase()
                    );

            order.setPaymentStatus(
                    paymentStatus
            );

            Order updatedOrder =
                    orderRepository.save(order);

            return ResponseEntity.ok(
                    updatedOrder
            );

        } catch (IllegalArgumentException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid payment status. " +
                            "Use PENDING, PAID or FAILED."
                    );
        }
    }

    // =========================
    // UPDATE ORDER STATUS
    // =========================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {

        Order order = orderRepository
                .findById(id)
                .orElse(null);

        if (order == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Order not found.");
        }

        String status =
                body.get("status");

        if (status == null || status.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("Order status is required.");
        }

        try {
            Order.OrderStatus orderStatus =
                    Order.OrderStatus.valueOf(
                            status.toUpperCase()
                    );

            order.setOrderStatus(
                    orderStatus
            );

            Order updatedOrder =
                    orderRepository.save(order);

            return ResponseEntity.ok(
                    updatedOrder
            );

        } catch (IllegalArgumentException ex) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid order status. " +
                            "Use PLACED, PROCESSING, SHIPPED or DELIVERED."
                    );
        }
    }
}