package com.example.backend.Loaders;

import com.example.backend.Entity.Month;
import com.example.backend.Entity.Role;
import com.example.backend.Entity.User;
import com.example.backend.Enums.MonthEnum;
import com.example.backend.Enums.RoleEnum;
import com.example.backend.Repository.MonthRepository;
import com.example.backend.Repository.RoleRepository;
import com.example.backend.Repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DefaultDatasLoader implements CommandLineRunner {
    private final UsersRepository usersRepository;
    private final RoleRepository roleRepository;
    private final MonthRepository monthRepository;


    @Override
    public void run(String... args) {
        String ownerUserName = "G'olib";
        if (
                roleRepository.findByRoleName(RoleEnum.ROLE_OWNER.name()) == null
                        && roleRepository.findByRoleName(RoleEnum.ROLE_MENTOR.name()) == null
                        && usersRepository.findByPhone("+998973002027") == null
                        && usersRepository.findByUsername(ownerUserName) == null
                        && monthRepository.findAll().isEmpty()
        ) {
            Role savedOwnerRole = roleRepository.save(
                    Role.builder()
                            .roleName(RoleEnum.ROLE_OWNER.name())
                            .build()
            );

            Role savedMentorRole = roleRepository.save(
                    Role.builder()
                            .roleName(RoleEnum.ROLE_MENTOR.name())
                            .build()
            );

            Role savedStudentRole = roleRepository.save(
                    Role.builder()
                            .roleName(RoleEnum.ROLE_STUDENT.name())
                            .build()
            );

            Role savedAdminRole = roleRepository.save(
                    Role.builder()
                            .roleName(RoleEnum.ROLE_ADMIN.name())
                            .build()
            );

            usersRepository.save(
                    User.builder()
                            .username(ownerUserName)
                            .password("lider_1")
                            .phone("+998973002027")
                            .role(savedOwnerRole)
                            .build()
            );

            monthRepository.save(generateMonthFromName(MonthEnum.JANUARY.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.FEBRUARY.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.MARCH.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.APRIL.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.MAY.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.JUNE.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.JULY.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.AUGUST.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.SEPTEMBER.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.OCTOBER.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.NOVEMBER.name()));
            monthRepository.save(generateMonthFromName(MonthEnum.DECEMBER.name()));
        }
    }

    private static Month generateMonthFromName(String monthName) {
        return new Month(
                null,
                monthName
        );
    }
}
