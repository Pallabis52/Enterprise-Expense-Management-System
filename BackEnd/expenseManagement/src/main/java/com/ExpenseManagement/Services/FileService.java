package com.expensemanagement.Services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

    private final String file_path = "uploads/";

    public String saveFile(MultipartFile Mfile) throws IOException {
        File file = new File(file_path);
        if (!file.exists()) {
            file.mkdir();
        }
        String fileName = System.currentTimeMillis() + " " + Mfile.getOriginalFilename();
        Path path = Paths.get(file_path + fileName);
        Files.write(path, Mfile.getBytes());
        return path.toString();
    }

}
