package edu.brown.cs.student.FilterTests;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;

import edu.brown.cs.student.FilterTests.MockedFilterResponse.MockedFilterResponse;
import edu.brown.cs.student.main.CoordinateData.CoordinateMockedData;
import edu.brown.cs.student.main.DistanceData.DistanceMockedData;
import edu.brown.cs.student.main.DistanceHandler.FilterHandler;
import okio.Buffer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

/** Unit testing the FilterHandler with mocked filter data. */
public class FilterMockedTest {

    /** Prepare for tests by getting server port. */
    @BeforeAll
    public static void setupOnce() {
        // Pick an arbitrary free port
        Spark.port(0);
        // Eliminate logger spam in console for test suite
        Logger.getLogger("").setLevel(Level.WARNING); // empty name = root
    }

    private JsonAdapter<MockedFilterResponse> filterAdapter;

    /** Establishes endpoint before each test. */
    @BeforeEach
    public void setup() {
        // Re-initialize parser, state, etc. for every test method

        Spark.get("/filter", new FilterHandler(new DistanceMockedData(), new CoordinateMockedData()));
        Spark.awaitInitialization(); // don't continue until the server is listening

        Moshi moshi = new Moshi.Builder().build();
        filterAdapter = moshi.adapter(MockedFilterResponse.class);
    }

    /** Allows Spark to reset after each test. */
    @AfterEach
    public void tearDown() {
        // Gracefully stop Spark listening on both endpoints
        Spark.unmap("/filter");
        Spark.awaitStop(); // don't proceed until the server is stopped
    }

    /**
     * Shuts down the server so maven does not error with other test classes.
     *
     * @throws InterruptedException for an issue clearing up
     */
    @AfterAll
    public static void shutdown() throws InterruptedException {
        Spark.stop();
        Thread.sleep(3000);
    }

    /**
     * Testing the filter handler with valid query params.
     *
     * @throws IOException for connection issues.
     */
    @Test
    public void testFilterNormalQuery() throws IOException {
        // Set up the request, make the request
        HttpURLConnection loadConnection = tryRequest("filter?workAddress=1%20INTERNATIONAL%20PL%20STE%20P110%20BOSTON%20MA&address=4%20DEVONSHIRE%20ST%20BOSTON%20MA");
        // Get the expected response: a success
        assertEquals(200, loadConnection.getResponseCode());
        MockedFilterResponse body =
                filterAdapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
        assertEquals("42.3556559", body.converted_work_latitude);
        assertEquals("-71.0521838", body.converted_work_longitude);
        assertEquals("42.3540901", body.converted_selected_latitude);
        assertEquals("-71.07004020962789", body.converted_selected_longitude);
        assertEquals("4 Charles Street, Boston 02116, United States", body.formatted_address);
        assertEquals("1 International Place, Downtown Boston, Boston 02110, United States", body.formatted_work_address);
        assertEquals("42.3556559,-71.0521838", body.destination);
        assertEquals("42.3540901,-71.07004020962789", body.origin);
        assertEquals("9 mins", body.duration);
        assertEquals("OK", body.status);
        assertEquals("1.3 mi", body.distance);

        loadConnection.disconnect();
    }


    /**
     * Testing the filter handler with a missing selected address input
     *
     * @throws IOException for connection issues.
     */
    @Test
    public void testFilterMissingSelected() throws IOException {
        // Set up the request, make the request
        HttpURLConnection loadConnection = tryRequest("filter?workAddress=1%20INTERNATIONAL%20PL%20STE%20P110%20BOSTON%20MA&address=");
        // Get the expected response: a success
        assertEquals(200, loadConnection.getResponseCode());
        MockedFilterResponse body =
                filterAdapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
        assertEquals(null, body.converted_work_latitude);
        assertEquals(null, body.converted_work_longitude);
        assertEquals(null, body.converted_selected_latitude);
        assertEquals(null, body.converted_selected_longitude);
        assertEquals(null, body.formatted_address);
        assertEquals(null, body.formatted_work_address);
        assertEquals(null, body.destination);
        assertEquals(null, body.origin);
        assertEquals("error_bad_request", body.result);
        assertEquals("selected address query parameter", body.missing);
        assertEquals("Invalid request: missing selected address query parameter", body.error);
        assertEquals(null, body.duration);
        assertEquals(null, body.status);
        assertEquals(null, body.distance);

        loadConnection.disconnect();
    }

    /**
     * Testing the filter handler with an invalid selected address input
     *
     * @throws IOException for connection issues.
     */
    @Test
    public void testFilterInvalidSelected() throws IOException {
        // Set up the request, make the request
        HttpURLConnection loadConnection = tryRequest("filter?workAddress=1%20INTERNATIONAL%20PL%20STE%20P110%20BOSTON%20MA&address=INVALID_ADDRESS");
        // Get the expected response: a success
        assertEquals(200, loadConnection.getResponseCode());
        MockedFilterResponse body =
                filterAdapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
        assertEquals("42.3556559", body.converted_work_latitude);
        assertEquals("-71.0521838", body.converted_work_longitude);
        assertEquals("0.0", body.converted_selected_latitude);
        assertEquals("0.0", body.converted_selected_longitude);
        assertEquals("", body.formatted_address);
        assertEquals("1 International Place, Downtown Boston, Boston 02110, United States", body.formatted_work_address);
        assertEquals("42.3556559,-71.0521838", body.destination);
        assertEquals("0.0,0.0", body.origin);
        assertEquals(null, body.duration);
        assertEquals(null, body.distance);
        assertEquals("ZERO_RESULTS", body.status);
        assertEquals("No route could be found between the origin and destination.", body.error);

        loadConnection.disconnect();
    }

    /**
     * Testing the filter handler with a missing work address input
     *
     * @throws IOException for connection issues.
     */
    @Test
    public void testFilterMissingWork() throws IOException {
        // Set up the request, make the request
        HttpURLConnection loadConnection = tryRequest("filter?workAddress=&address=4%20DEVONSHIRE%20ST%20BOSTON%20MA");
        // Get the expected response: a success
        assertEquals(200, loadConnection.getResponseCode());
        MockedFilterResponse body =
                filterAdapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
        assertEquals(null, body.converted_work_latitude);
        assertEquals(null, body.converted_work_longitude);
        assertEquals("42.3540901", body.converted_selected_latitude);
        assertEquals("-71.07004020962789", body.converted_selected_longitude);
        assertEquals("4 Charles Street, Boston 02116, United States", body.formatted_address);
        assertEquals(null, body.formatted_work_address);
        assertEquals(null, body.destination);
        assertEquals(null, body.origin);
        assertEquals("error_bad_request", body.result);
        assertEquals("work address query parameter", body.missing);
        assertEquals("Invalid request: missing work address query parameter", body.error);
        assertEquals(null, body.duration);
        assertEquals(null, body.status);
        assertEquals(null, body.distance);

        loadConnection.disconnect();
    }

    /**
     * Testing the filter handler with an invalid work address input
     *
     * @throws IOException for connection issues.
     */
    @Test
    public void testFilterInvalidWork() throws IOException {
        // Set up the request, make the request
        HttpURLConnection loadConnection = tryRequest("filter?workAddress=INVALID_ADDRESS&address=4%20DEVONSHIRE%20ST%20BOSTON%20MA");
        // Get the expected response: a success
        assertEquals(200, loadConnection.getResponseCode());
        MockedFilterResponse body =
                filterAdapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
        assertEquals("0.0", body.converted_work_latitude);
        assertEquals("0.0", body.converted_work_longitude);
        assertEquals("42.3540901", body.converted_selected_latitude);
        assertEquals("-71.07004020962789", body.converted_selected_longitude);
        assertEquals("4 Charles Street, Boston 02116, United States", body.formatted_address);
        assertEquals("", body.formatted_work_address);
        assertEquals("0.0,0.0", body.destination);
        assertEquals("42.3540901,-71.07004020962789", body.origin);
        assertEquals(null, body.duration);
        assertEquals(null, body.distance);
        assertEquals("ZERO_RESULTS", body.status);
        assertEquals("No route could be found between the origin and destination.", body.error);

        loadConnection.disconnect();
    }

    /**
     * Testing the filter handler with unmocked data inputs
     *
     * @throws IOException for connection issues.
     */
    @Test
    public void testFilterUnmocked() throws IOException {
        // Set up the request, make the request
        HttpURLConnection loadConnection = tryRequest("filter?workAddress=notMocked&address=notMocked");
        // Get the expected response: a success
        assertEquals(200, loadConnection.getResponseCode());
        MockedFilterResponse body =
                filterAdapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
        assertEquals(null, body.converted_work_latitude);
        assertEquals(null, body.converted_work_longitude);
        assertEquals(null, body.converted_selected_latitude);
        assertEquals(null, body.converted_selected_longitude);
        assertEquals(null, body.formatted_address);
        assertEquals(null, body.formatted_work_address);
        assertEquals(null, body.destination);
        assertEquals(null, body.origin);
        assertEquals(null, body.duration);
        assertEquals(null, body.distance);
        assertEquals(null, body.status);
        assertEquals("Address coordinates are unmocked.", body.error);

        loadConnection.disconnect();
    }

    /**
     * Helper to start a connection to a specific API endpoint/params
     *
     * @param apiCall the call string, including endpoint (Note: this would be better if it had more
     *     structure!)
     * @return the connection for the given URL, just after connecting
     * @throws IOException if the connection fails for some reason
     */
    private HttpURLConnection tryRequest(String apiCall) throws IOException {
        // Configure the connection (but don't actually send a request yet)
        URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
        HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
        // The request body contains a Json object
        clientConnection.setRequestProperty("Content-Type", "application/json");
        // We're expecting a Json object in the response body
        clientConnection.setRequestProperty("Accept", "application/json");

        clientConnection.connect();
        return clientConnection;
    }
}
