package edu.brown.cs.student.main.CoordinateData;

import edu.brown.cs.student.main.CoordinateData.CoordinateApiResponse;
import edu.brown.cs.student.main.DistanceData.DistanceApiResponse;
import edu.brown.cs.student.main.DistanceData.DistanceData;
import kotlin.collections.ArrayDeque;

import java.util.ArrayList;

/** Class for mocking responses from the filtering of the GeoJson. */
public class CoordinateMockedData implements CoordinateData {

    /**
     * Returns mock responses for converting address to coordinates data.
     *
     * @param address user's address they want to convert
     * @return the geo json data filtered by a bounding box.
     */
    @Override
    public CoordinateApiResponse getCoordinateData(String address) {
        CoordinateApiResponse mockedConversionObject = new CoordinateApiResponse();

        if (address.equals("1%20INTERNATIONAL%20PL%20STE%20P110%20BOSTON%20MA")) {
            System.out.println("FOUND ADDRESS 1");
            mockedConversionObject.status = "OK";
            ArrayList<CoordinateApiResponse.Result> allResults = new ArrayList<>();

            CoordinateApiResponse.Result result = new CoordinateApiResponse.Result();
            result.formatted_address = "1 International Place, Downtown Boston, Boston 02110, United States";

            CoordinateApiResponse.Geometry geometry = new CoordinateApiResponse.Geometry();
            CoordinateApiResponse.Location location = new CoordinateApiResponse.Location();
            location.lat = 42.3556559;
            location.lng = -71.0521838;
            geometry.location = location;
            result.geometry = geometry;

            allResults.add(result);
            mockedConversionObject.result = allResults;

        } else if (address.equals("4%20DEVONSHIRE%20ST%20BOSTON%20MA")){
            System.out.println("FOUND ADDRESS 2");

            mockedConversionObject.status = "OK";
            ArrayList<CoordinateApiResponse.Result> allResults = new ArrayList<>();

            CoordinateApiResponse.Result result = new CoordinateApiResponse.Result();
            result.formatted_address = "4 Charles Street, Boston 02116, United States";

            CoordinateApiResponse.Geometry geometry = new CoordinateApiResponse.Geometry();
            CoordinateApiResponse.Location location = new CoordinateApiResponse.Location();
            location.lat = 42.3540901;
            location.lng = -71.07004020962789;
            geometry.location = location;
            result.geometry = geometry;

            allResults.add(result);
            mockedConversionObject.result = allResults;
        } else {
            mockedConversionObject.error_message = "This address was not found in mocked data.";
        }
        return mockedConversionObject;
    }
}
