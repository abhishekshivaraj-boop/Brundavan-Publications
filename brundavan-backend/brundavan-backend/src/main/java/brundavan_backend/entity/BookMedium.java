package brundavan_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(
    name = "book_mediums",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "unique_book_medium",
            columnNames = {"book_id", "medium"}
        )
    }
)
public class BookMedium {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnore
    private Book book;

    @Enumerated(EnumType.STRING)
    @Column(name = "medium", nullable = false)
    private Medium medium;

    public BookMedium() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Medium getMedium() {
        return medium;
    }

    public void setMedium(Medium medium) {
        this.medium = medium;
    }

    public enum Medium {
        KANNADA,
        ENGLISH,
        HINDI,
        MARATHI
    }
}
