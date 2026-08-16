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
    public ResponseEntity<?> createOrder(
            @RequestBody Order order
    ) {

        if (order.getOrderItems() == null ||
                order.getOrderItems().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Order must contain at least one item.");
        }

        /*
         * Validate every item and stock before
         * saving anything.
         */
        for (OrderItem item : order.getOrderItems()) {

            if (item.getBook() == null ||
                    item.getBook().getId() == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Each order item must contain a book ID.");
            }

            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body("Order quantity must be greater than zero.");
            }

            Book book = bookRepository
                    .findById(item.getBook().getId())
                    .orElse(null);

            if (book == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Book not found: " +
                                item.getBook().getId()
                        );
            }

            Integer currentStock = book.getStock();

            if (currentStock == null) {
                currentStock = 0;
            }

            int requestedQuantity =
                    item.getQuantity();

            if (currentStock < requestedQuantity) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(
                                "Insufficient stock for \"" +
                                book.getTitle() +
                                "\". Available: " +
                                currentStock +
                                ", requested: " +
                                requestedQuantity
                        );
            }
        }

        /*
         * Stock validation passed for every item.
         * Now update the actual Book references
         * and reduce stock.
         */
        for (OrderItem item : order.getOrderItems()) {

            Book book = bookRepository
                    .findById(item.getBook().getId())
                    .orElseThrow();

            int newStock =
                    book.getStock() -
                    item.getQuantity();

            book.setStock(newStock);

            bookRepository.save(book);

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

        String status = body.get("status");

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

        String status = body.get("status");

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