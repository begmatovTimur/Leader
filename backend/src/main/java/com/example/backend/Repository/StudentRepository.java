package com.example.backend.Repository;

import com.example.backend.Entity.Student;
import com.example.backend.Projection.CourseProjection;
import com.example.backend.Projection.StudentCourseProjection;
import com.example.backend.Projection.StudentProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {
    @Query(value = """
            select c.id, c.name
            from student_course sc
                     inner join course c on c.id = sc.course_id
            where sc.student_id = :id
            group by c.id, c.name
            """, nativeQuery = true)
    List<CourseProjection> getStudentCourses(UUID id);

    @Query(value = """
            select sc.id,
                   sc.active,
                   sc.payment_amount,
                   sc.payment_index,
                   s.first_name,
                   m.name                                      as month_name,
                   TO_CHAR(sc.payed_at, 'YYYY-"yil" DD-Month') AS payed_at
            from student_course sc
                     inner join student s on s.id = sc.student_id
                     inner join month m on sc.month_id = m.id
                     inner join course c on c.id = sc.course_id
            where c.id = :courseId
              and s.id = :studentId
            order by sc.id asc
            """, nativeQuery = true)
    List<StudentCourseProjection> getStudentCourse(UUID courseId, UUID studentId);

    @Query(value = """
            SELECT *
            FROM student
            WHERE LOWER(first_name) LIKE LOWER('%' || :filterText || '%')
               OR LOWER(last_name) LIKE LOWER('%' || :filterText || '%');

            """, nativeQuery = true)
    List<Student> filterByFirstNameOrLastNameBySimilarity(String filterText);

    @Query(value = """
       SELECT s.first_name,
              s.last_name,
              s.age,
              json_agg(
                      json_build_object(
                              'month', m.name,
                              'amount', CONCAT(sc.payment_amount, ' - ', sc.payment_index)
                          ) ORDER BY m.id
                  ) AS payments
       FROM student s
                INNER JOIN student_course sc ON s.id = sc.student_id
                INNER JOIN month m ON m.id = sc.month_id
       WHERE sc.payment_amount = 0 AND m.id<=:monthId
       GROUP BY
           s.first_name, s.last_name, s.age
       ORDER BY
           s.first_name, s.last_name, s.age
""", nativeQuery = true)
    List<StudentProjection> convertToExcelFileByMonth(Integer monthId);
    @Query(value = """
            SELECT s.first_name,
                                                            s.last_name,
                                                            s.age,
                                                            json_agg(
                                                                    json_build_object(
                                                                            'month', m.name,
                                                                            'amount', CONCAT(sc.payment_amount, ' - ', sc.payment_index)
                                                                        ) ORDER BY m.id
                                                                ) AS payments
                                                     FROM student s
                                                              INNER JOIN student_course sc ON s.id = sc.student_id
                                                              INNER JOIN month m ON m.id = sc.month_id
                                                     WHERE (sc.course_id = :courseId)
                                                     GROUP BY
                                                         s.first_name, s.last_name, s.age
                                                     ORDER BY
                                                         s.first_name, s.last_name, s.age                    
                   """, nativeQuery = true)
    List<StudentProjection> convertToExcelFileByCourse(UUID courseId);
    @Query(value = """
            SELECT s.first_name,
                                                            s.last_name,
                                                            s.age,
                                                            json_agg(
                                                                    json_build_object(
                                                                            'month', m.name,
                                                                            'amount', CONCAT(sc.payment_amount, ' - ', sc.payment_index)
                                                                        ) ORDER BY m.id
                                                                ) AS payments
                                                     FROM student s
                                                              INNER JOIN student_course sc ON s.id = sc.student_id
                                                              INNER JOIN month m ON m.id = sc.month_id
                                                     GROUP BY
                                                         s.first_name, s.last_name, s.age
                                                     ORDER BY
                                                         s.first_name, s.last_name, s.age                    
                   """, nativeQuery = true)
    List<StudentProjection> convertToExcelFileByNothing();

    @Query(value = """
           select s.id, s.age, s.first_name, s.last_name, s.register_date
           from student s
                    inner join student_course sc on s.id = sc.student_id
                    inner join course c on c.id = sc.course_id
           where sc.course_id = :id OR :id IS NULL
           group by s.id, s.age, s.first_name, s.last_name, s.register_date
            """, nativeQuery = true)
    List<Student> getStudentsByGroup(UUID id);

    @Query(value = """
  SELECT s.id, s.age, s.first_name, s.last_name, s.register_date
    FROM student s
    INNER JOIN student_course sc ON s.id = sc.student_id
    INNER JOIN month m ON m.id = sc.month_id
    WHERE sc.payment_amount = 0 AND m.id <= :monthId
    GROUP BY s.id, s.age, s.first_name, s.last_name, sc.student_id, s.register_date                                                                            
""", nativeQuery = true)
    List<Student> getStudentByDebt(Integer monthId);
    @Query(value = """
       SELECT s.first_name,
              s.last_name,
              s.age,
              json_agg(
                      json_build_object(
                              'month', m.name,
                              'amount', CONCAT(sc.payment_amount, ' - ', sc.payment_index)
                          ) ORDER BY m.id
                  ) AS payments
       FROM student s
                INNER JOIN student_course sc ON s.id = sc.student_id
                INNER JOIN month m ON m.id = sc.month_id
       WHERE sc.payment_amount = 0 AND m.id<=:monthId AND (sc.course_id = :courseId)
       GROUP BY
           s.first_name, s.last_name, s.age
       ORDER BY
           s.first_name, s.last_name, s.age
""", nativeQuery = true)
    List<StudentProjection> convertToExcelFileByAll(Integer monthId,UUID courseId);

    @Query(value = """
  SELECT s.id, s.age, s.first_name, s.last_name, s.register_date
    FROM student s
    INNER JOIN student_course sc ON s.id = sc.student_id
    INNER JOIN month m ON m.id = sc.month_id
    WHERE sc.payment_amount = 0 AND m.id<=:monthId AND (sc.course_id = :courseId)
    GROUP BY s.id, s.age, s.first_name, s.last_name, sc.student_id, s.register_date                                                                            
""", nativeQuery = true)
    List<Student> getStudentsByAll(Integer monthId, UUID courseId);
}
