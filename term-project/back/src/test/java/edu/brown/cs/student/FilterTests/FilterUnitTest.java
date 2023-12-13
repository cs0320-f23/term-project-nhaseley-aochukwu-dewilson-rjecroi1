package edu.brown.cs.student.FilterTests;

import com.google.gson.JsonObject;
import edu.brown.cs.student.main.CoordinateData.CoordinateApiResponse;
import edu.brown.cs.student.main.CoordinateData.CoordinateDataSource;
import edu.brown.cs.student.main.DistanceData.DistanceApiResponse;
import edu.brown.cs.student.main.DistanceData.DistanceDataSource;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;


public class FilterUnitTest {
    /**
     * Unit testing for coordinate conversion given a valid address
     */
    @Test
    public void testNormalCoordinateConversion() {
        CoordinateDataSource coordinateSource = new CoordinateDataSource();
        CoordinateApiResponse coordinateRes = coordinateSource.getCoordinateData("4 Devonshire St, Boston, MA 02109, USA");
        assertEquals("OK", coordinateRes.status);
        assertEquals("4 Devonshire St, Boston, MA 02109, USA", coordinateRes.result.get(0).formatted_address);
        assertEquals(42.3587053, coordinateRes.result.get(0).geometry.location.lat);
        assertEquals(-71.0567859, coordinateRes.result.get(0).geometry.location.lng);
    }

    /**
     * Unit testing for coordinate conversion given an normal address
     */
    @Test
    public void testNormalCoordinateConversion2() {
        CoordinateDataSource coordinateSource = new CoordinateDataSource();
        CoordinateApiResponse coordinateRes = coordinateSource.getCoordinateData("1 International Pl p110, Boston, MA 02110, USA");
        assertEquals("OK", coordinateRes.status);
        assertEquals("1 International Pl p110, Boston, MA 02110, USA", coordinateRes.result.get(0).formatted_address);
        assertEquals(42.3560387, coordinateRes.result.get(0).geometry.location.lat);
        assertEquals(-71.052138, coordinateRes.result.get(0).geometry.location.lng);
    }

    /**
     * Unit testing for coordinate conversion given an empty address
     */
    @Test
    public void testNoInputCoordinateConversion() {
        CoordinateDataSource coordinateSource = new CoordinateDataSource();
        CoordinateApiResponse coordinateRes = coordinateSource.getCoordinateData("");
        assertEquals("INVALID_REQUEST", coordinateRes.status);
        assertEquals(null, coordinateRes.result);
    }

    /**
     * Unit testing for coordinate conversion given a nonexistent address
     */
    @Test
    public void testInvalidInputCoordinateConversion() {
        CoordinateDataSource coordinateSource = new CoordinateDataSource();
        CoordinateApiResponse coordinateRes = coordinateSource.getCoordinateData("INVALID_ADDRESS");
        assertEquals("OK", coordinateRes.status);
        assertEquals("", coordinateRes.result.get(0).formatted_address);
        assertEquals(0, coordinateRes.result.get(0).geometry.location.lat);
        assertEquals(0, coordinateRes.result.get(0).geometry.location.lng);
    }

    /**
     * Unit testing for finding distance between 2 normal addresses
     */
    @Test
    public void testNormalDistance() {
        DistanceDataSource filterer = new DistanceDataSource();
        DistanceApiResponse body = filterer.getDistanceData("42.3587053", "-71.0567859", "42.3560387", "-71.052138");
        assertEquals("0.4 mi", body.rows.get(0).elements.get(0).distance.text);
        assertEquals("3 mins", body.rows.get(0).elements.get(0).duration.text);
        assertEquals("OK", body.rows.get(0).elements.get(0).status);
        assertEquals("42.3587053,-71.0567859", body.rows.get(0).elements.get(0).origin);
        assertEquals("42.3560387,-71.052138", body.rows.get(0).elements.get(0).destination);
    }

    /**
     * Unit testing for finding distance between 2 lat/long coordinates with no route between them
     */
    @Test
    public void testNoRouteDistance() {
        DistanceDataSource filterer = new DistanceDataSource();
        DistanceApiResponse body = filterer.getDistanceData("18.2779531", "-78.3494771", "42.3560387", "-71.0521838");
        assertEquals(null, body.rows.get(0).elements.get(0).distance);
        assertEquals(null, body.rows.get(0).elements.get(0).duration);
        assertEquals("ZERO_RESULTS", body.rows.get(0).elements.get(0).status);
        assertEquals("18.2779531,-78.3494771", body.rows.get(0).elements.get(0).origin);
        assertEquals("42.3560387,-71.0521838", body.rows.get(0).elements.get(0).destination);
    }

    /**
     * Unit testing for finding distance between 2 lat/long coordinates with a missing latitude entry in selected address
     */
    @Test
    public void testMissingSelectedLatDistance() {
        DistanceDataSource filterer = new DistanceDataSource();
        DistanceApiResponse body = filterer.getDistanceData("42.3587053", "", "42.3560387", "-71.052138");
        assertEquals(null, body.rows.get(0).elements.get(0).distance);
        assertEquals(null, body.rows.get(0).elements.get(0).duration);
        assertEquals("ZERO_RESULTS", body.rows.get(0).elements.get(0).status);
        assertEquals("42.3587053,", body.rows.get(0).elements.get(0).origin);
        assertEquals("42.3560387,-71.052138", body.rows.get(0).elements.get(0).destination);
    }


    /**
     * Unit testing for finding distance between 2 lat/long coordinates with a missing longitude entry in selected address
     */
    @Test
    public void testMissingSelectedLongDistance() {
        DistanceDataSource filterer = new DistanceDataSource();
        DistanceApiResponse body = filterer.getDistanceData("42.3587053", "-71.0567859", "", "-71.052138");
        assertEquals(null, body.rows.get(0).elements.get(0).distance);
        assertEquals(null, body.rows.get(0).elements.get(0).duration);
        assertEquals("ZERO_RESULTS", body.rows.get(0).elements.get(0).status);
        assertEquals("42.3587053,-71.0567859", body.rows.get(0).elements.get(0).origin);
        assertEquals(",-71.052138", body.rows.get(0).elements.get(0).destination);
    }


    /**
     * Unit testing for finding distance between 2 lat/long coordinates with a missing latitude entry in work address
     */
    @Test
    public void testInvalidWorkLatDistance() {
        DistanceDataSource filterer = new DistanceDataSource();
        DistanceApiResponse body = filterer.getDistanceData("42.3587053", "-71.0567859", "", "-71.052138");
        assertEquals(null, body.rows.get(0).elements.get(0).distance);
        assertEquals(null, body.rows.get(0).elements.get(0).duration);
        assertEquals("ZERO_RESULTS", body.rows.get(0).elements.get(0).status);
        assertEquals("42.3587053,-71.0567859", body.rows.get(0).elements.get(0).origin);
        assertEquals(",-71.052138", body.rows.get(0).elements.get(0).destination);
    }


    /**
     * Unit testing for finding distance between 2 lat/long coordinates with a missing longitude entry in work address
     */
    @Test
    public void testInvalidWorkLongDistance() {
        DistanceDataSource filterer = new DistanceDataSource();
        DistanceApiResponse body = filterer.getDistanceData("42.3587053", "-71.0567859", "42.3560387", "");
        assertEquals(null, body.rows.get(0).elements.get(0).distance);
        assertEquals(null, body.rows.get(0).elements.get(0).duration);
        assertEquals("ZERO_RESULTS", body.rows.get(0).elements.get(0).status);
        assertEquals("42.3587053,-71.0567859", body.rows.get(0).elements.get(0).origin);
        assertEquals("42.3560387,", body.rows.get(0).elements.get(0).destination);
    }
}