package com.hoaxify.hoaxify.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.hoaxify.shared.CurrentUser;

@RestController
public class LoginController {

	
	@PostMapping("/api/1.0/login")
	
	User handleLogin(@CurrentUser User loggedInUser) {
		
		return loggedInUser;
	}
}
