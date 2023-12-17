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
        System.out.println("body" + body.status);
        assertEquals("42.3560387", body.converted_work_latitude);
        assertEquals("-71.052138", body.converted_work_longitude);
        assertEquals("42.3587053", body.converted_selected_latitude);
        assertEquals("-71.0567859", body.converted_selected_longitude);
        assertEquals("4 Devonshire St, Boston, MA 02109, USA", body.formatted_address);
        assertEquals("1 International Pl p110, Boston, MA 02110, USA", body.formatted_work_address);
        assertEquals("42.3560387,-71.052138", body.destination);
        assertEquals("42.3587053,-71.0567859", body.origin);
        assertEquals("3 mins", body.duration);
        assertEquals("200", body.status);
        assertEquals("0.4 mi", body.distance);

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
        System.out.println("sending: " + requestURL);
        HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
        // The request body contains a Json object
        clientConnection.setRequestProperty("Content-Type", "application/json");
        // We're expecting a Json object in the response body
        clientConnection.setRequestProperty("Accept", "application/json");

        clientConnection.connect();
        return clientConnection;
    }
}
