package com.hoaxify.hoaxify;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;

import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.junit.runners.Parameterized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

import com.hoaxify.hoaxify.error.ApiError;
import com.hoaxify.hoaxify.shared.GenericResponse;
import com.hoaxify.hoaxify.user.User;
import com.hoaxify.hoaxify.user.UserRepository;
import com.hoaxify.hoaxify.user.UserService;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class UserControllerTest {

	private static final String API_1_0_USERS = "/api/1.0/users";
	@Autowired
	TestRestTemplate testRestTemplate;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserService userService;
	
	@Before
	public void cleanup() {
		userRepository.deleteAll();
	}
	
	@Test
	public void postUser_whenUserIsValid_receiveOk() {
		User user = TestUtil.createValidUser();
		ResponseEntity<Object> response = testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void postUser_whenUserIsValid_userSavedToDatabase() {
		User user = TestUtil.createValidUser();
		testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
		assertThat(userRepository.count()).isEqualTo(1);
		
	}
	
	@Test
	public void postUser_whenUserIsValid_receiveSuccessMessage() {
		User user = TestUtil.createValidUser();
		ResponseEntity<GenericResponse> response = testRestTemplate.postForEntity(API_1_0_USERS, user, GenericResponse.class);
		assertThat(response.getBody().getMessage()).isNotNull();
	}
	
	@Test
	public void postUser_whenUserIsValid_passwordIsHashedInDatabase() {
		User user = TestUtil.createValidUser();
		testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class);
		List<User> users = userRepository.findAll();
		User inDB = users.get(0);
		assertThat(inDB.getPassword()).isNotEqualTo(user.getPassword());
	}
	@Test
	public void postUser_whenUserHasNullUsername_BadRequest() {
		User user = TestUtil.createValidUser();
		user.setUsername(null);
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	
	@Test
	public void postUser_whenUserHasNullDisplayName_BadRequest() {
		User user = TestUtil.createValidUser();
		user.setDisplayName(null);
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	@Test
	public void postUser_whenUserHasNullPassword_BadRequest() {
		User user = TestUtil.createValidUser();
		user.setPassword(null);
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	@Test
	public void postUser_whenUserHasNullUsernameWithLessThanRequired_BadRequest() {
		User user = TestUtil.createValidUser();
		user.setUsername("abc");
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	public void postUser_whenUserHasNullDisplaynameWithLessThanRequired_BadRequest() {
		User user = TestUtil.createValidUser();
		user.setDisplayName("abv");
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	public void postUser_whenUserHasNullPasswordWithLessThanRequired_BadRequest() {
		User user = TestUtil.createValidUser();
		user.setPassword("p4asswd");
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	@Test
	public void postUser_whenUserHasNullUsernameExceedTheLengthLimit_BadRequest() {
		User user = TestUtil.createValidUser();
		String valueOf256Chars = IntStream.rangeClosed(1,256).mapToObj(x->"a").collect(Collectors.joining());
		user.setUsername(valueOf256Chars);
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	@Test
	public void postUser_whenUserHasNullDisplayNameExceedTheLengthLimit_BadRequest() {
		User user = TestUtil.createValidUser();
		String valueOf256Chars = IntStream.rangeClosed(1,256).mapToObj(x->"a").collect(Collectors.joining());
		user.setDisplayName(valueOf256Chars);
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	@Test
	public void postUser_whenUserHasNullPasswordExceedTheLengthLimit_BadRequest() {
		User user = TestUtil.createValidUser();
		String valueOf256Chars = IntStream.rangeClosed(1,256).mapToObj(x->"a").collect(Collectors.joining());
		user.setPassword(valueOf256Chars + "A1");
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	@Test
	public void postUser_whenUserHasPasswordWithLowercase_BadRequest() {
		User user = TestUtil.createValidUser();
		user.setPassword("lowercase");
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	public void postUser_whenUserHasPasswordWithUppercase_BadRequest() {
		User user = TestUtil.createValidUser();
		user.setPassword("UPPERCASE");
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	public void postUser_whenUserHasPasswordWithAllNumber_BadRequest() {
		User user = TestUtil.createValidUser();
		user.setPassword("123456789");
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	
	@Test
	public void postUser_whenUserIsValid_recieveApiError() {
		User user = new User();
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
		assertThat(response.getBody().getUrl()).isEqualTo(API_1_0_USERS);
	}
	@Test
	public void postUser_whenUserIsValid_recieveApiErrorWithValidationErrors() {
		User user = new User();
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
		assertThat(response.getBody().getValidationErrors().size()).isEqualTo(3);
	}
	
	@Test
	public void postUser_whenUserHasNullUsername_recieveMessageOfNullErrorForUsername() {
		User user = TestUtil.createValidUser();
		user.setUsername(null);
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
		Map<String, String> validationErrors = response.getBody().getValidationErrors();
		assertThat(validationErrors.get("username")).isEqualTo("Username cannot be null");
	}
	
	@Test
	public void postUser_whenUserHasNullPassword_recieveGenericMessageOfNullError() {
		User user = TestUtil.createValidUser();
		user.setPassword(null);
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
		Map<String, String> validationErrors = response.getBody().getValidationErrors();
		assertThat(validationErrors.get("password")).isEqualTo("Cannot be null");
	}
	@Test
	public void postUser_whenUserHasInvalidLengthUsername_recieveGenericMessageOfSizeError() {
		User user = TestUtil.createValidUser();
		user.setUsername("abc");
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
		Map<String, String> validationErrors = response.getBody().getValidationErrors();
		assertThat(validationErrors.get("username")).isEqualTo("It must have minimum 4 and maximum 255 characters");
	}
	public void postUser_whenUserHasInvalidPasswordPattern_recieveMessageOfPasswordPatternError() {
		User user = TestUtil.createValidUser();
		user.setPassword("alllowercase");
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
		Map<String, String> validationErrors = response.getBody().getValidationErrors();
		assertThat(validationErrors.get("password")).isEqualTo("Password must have at least one uppercase, one lowercase letter and one number");
	}
	
	public void postUser_whenAnotherUserHasSameUsername_recieveBadRequest() {
		userRepository.save(TestUtil.createValidUser());
		
		User user = TestUtil.createValidUser();
		ResponseEntity<Object> response = postSignup(user, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
	public void postUser_whenAnotherUserHasSameUsername_recieveMessageOfDuplicateUsername() {
		userRepository.save(TestUtil.createValidUser());
		
		User user = TestUtil.createValidUser();
		
		
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
		Map<String, String> validationErrors = response.getBody().getValidationErrors();
		assertThat(validationErrors.get("username")).isEqualTo("This name is in use");

	}
	@Test
	public void getUsers_whenThereAreNoUsersInDb_recievePageWithZeroItems() {
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {
		});
		assertThat(response.getBody().getTotalElements()).isEqualTo(0);
	}
	@Test
	public void getUsers_whenThereIsAUserInDB_recievePageWithUser() {
		userRepository.save(TestUtil.createValidUser());
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {
		});
		assertThat(response.getBody().getTotalElements()).isEqualTo(1);
	}
	/*
	@Test
	public void getUsers_whenThereIsAUserInDB_recieveUserWithoutPassword() {
		userRepository.save(TestUtil.createValidUser());
		ResponseEntity<TestPage<Map<String, Object>>> response = getUsers(new ParameterizedTypeReference<TestPage<Map<String, Object>>>() {});
		Map<String, Object> entity = response.getBody().getContent().get(0);
		assertThat(entity.containsKey("password")).isFalse();
	}*/
	@Test
	public void getUsers_whenThereAreNoUsersInDb_recieveOk() {
		ResponseEntity<Object> response = testRestTemplate.getForEntity(API_1_0_USERS, Object.class);
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	/*
	@Test
	public void getUsers_whenPageIsRequestedFor3ItemsPerPageWhereTheDatabaseHas20Users_receive3Users() {
		IntStream.rangeClosed(1, 20).mapToObj(i -> "test-user-" + i)
			.map(TestUtil::createValidUser)
			.forEach(userRepository::save);
		String path = API_1_0_USERS + "?page=0&size=3";
		ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<TestPage<Object>>() {	});
		assertThat(response.getBody().getContent().size()).isEqualTo(3);
	}*/
	
	//Eğer listelemede hata alınırsa buraya dön!!!!!!
	@Test
	public void getUsers_whenPageSizeNotProvided_recievePageSizeAs10() {
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {
		});
		assertThat(response.getBody().getSize()).isEqualTo(10);
	}
	@Test
	public void getUsers_whenPageSizeIsGreaterThan100_recievePageSizeAs100() {
		String path = API_1_0_USERS + "?size=500";
		ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<TestPage<Object>>() {
		});
		assertThat(response.getBody().getSize()).isEqualTo(100);
	}
	@Test
	public void getUsers_whenPageSizeIsNegative_recievePageSizeAs10() {
		String path = API_1_0_USERS + "?size=-5";
		ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<TestPage<Object>>() {
		});
		assertThat(response.getBody().getSize()).isEqualTo(10);
	}
	@Test
	public void getUsers_whenPageSizeIsNegative_recieveFirstAge() {
		String path = API_1_0_USERS + "?size=-5";
		ResponseEntity<TestPage<Object>> response = getUsers(path, new ParameterizedTypeReference<TestPage<Object>>() {
		});
		assertThat(response.getBody().getNumber()).isEqualTo(0);
	}
	
	public void getUsers_whenUserLoggedIn_recievePageWithoutLoggedInUser() {
		userService.save(TestUtil.createValidUser("user1"));
		userService.save(TestUtil.createValidUser("user2"));
		userService.save(TestUtil.createValidUser("user3"));
		
		authenticate("user1");
		
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {
		});
		
		assertThat(response.getBody().getTotalElements()).isEqualTo(2);
		
	}
	public <T> ResponseEntity<T> postSignup(Object request, Class<T> response){
		return testRestTemplate.postForEntity(API_1_0_USERS, request, response);
	}
	
	public <T> ResponseEntity<T> getUsers(ParameterizedTypeReference<T> responseType){
		return testRestTemplate.exchange(API_1_0_USERS,HttpMethod.GET, null, responseType);
	}
	public <T> ResponseEntity<T> getUsers(String path, ParameterizedTypeReference<T> responseType){
		return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
	}
	
	private void authenticate (String username) {
		testRestTemplate.getRestTemplate().
			getInterceptors().add(new BasicAuthenticationInterceptor("test-user", "P4ssword")); 
	}
	
}
