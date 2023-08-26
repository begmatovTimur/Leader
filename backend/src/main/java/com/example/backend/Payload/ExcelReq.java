package com.example.backend.Payload;

import com.example.backend.DTO.TimeTableDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExcelReq {
    private String firstName;
    private String lastName;
    private String age;
    List<TimeTableDTO> monthlyData;
}
