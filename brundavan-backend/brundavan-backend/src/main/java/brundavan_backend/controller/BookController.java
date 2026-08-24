package brundavan_backend.controller;

import brundavan_backend.entity.Book;
import brundavan_backend.entity.BookMedium;
import brundavan_backend.repository.BookRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    }
)
public class BookController {

    private final BookRepository bookRepository;

    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // GET all books
    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // GET one book
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(
            @PathVariable Long id
    ) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // ADD book
    @PostMapping
    public ResponseEntity<Book> createBook(
            @RequestBody Book book
    ) {

        if (book.getMediums() != null) {
            for (BookMedium medium : book.getMediums()) {
                medium.setBook(book);
            }
        }

        Book savedBook =
                bookRepository.save(book);

        return ResponseEntity.ok(savedBook);
    }

    // UPDATE book
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Long id,
            @RequestBody Book updatedBook
    ) {

        return bookRepository.findById(id)
                .map(existingBook -> {

                    existingBook.setTitle(
                            updatedBook.getTitle()
                    );

                    existingBook.setDescription(
                            updatedBook.getDescription()
                    );

                    existingBook.setOriginalPrice(
                            updatedBook.getOriginalPrice()
                    );

                    existingBook.setDiscountPercent(
                            updatedBook.getDiscountPercent()
                    );

                    existingBook.setPrice(
                            updatedBook.getPrice()
                    );

                    existingBook.setStock(
                            updatedBook.getStock()
                    );

                    existingBook.setLanguage(
                            updatedBook.getLanguage()
                    );

                    existingBook.setSubject(
                            updatedBook.getSubject()
                    );

                    existingBook.setCoverImageUrl(
                            updatedBook.getCoverImageUrl()
                    );

                    existingBook.setIsActive(
                            updatedBook.getIsActive()
                    );

                    // FIX: properly attach every medium to the existing book
                    existingBook.getMediums().clear();

                    if (updatedBook.getMediums() != null) {
                        for (BookMedium medium : updatedBook.getMediums()) {
                            medium.setBook(existingBook);
                            existingBook.getMediums().add(medium);
                        }
                    }

                    Book savedBook =
                            bookRepository.save(existingBook);

                    return ResponseEntity.ok(savedBook);
                })
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // DEACTIVATE book instead of hard delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(
            @PathVariable Long id
    ) {

        return bookRepository.findById(id)
                .map(book -> {

                    book.setIsActive(false);

                    bookRepository.save(book);

                    return ResponseEntity
                            .noContent()
                            .<Void>build();
                })
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // REACTIVATE book
    @PutMapping("/{id}/reactivate")
    public ResponseEntity<Book> reactivateBook(
            @PathVariable Long id
    ) {

        return bookRepository.findById(id)
                .map(book -> {

                    book.setIsActive(true);

                    Book savedBook =
                            bookRepository.save(book);

                    return ResponseEntity.ok(savedBook);
                })
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }
}

