package edu.brown.cs.student.main.DistanceData;

import java.util.ArrayList;

/** Class for mocking responses from the filtering of the GeoJson. */
public class DistanceMockedData implements DistanceData {

    /**
     * Returns mock responses for filtering GeoJson data.
     *
     * @param selectedLat selected latitude.
     * @param selectedLong selected longitude.
     * @param workLat work longitude.
     * @param workLong work longitude.
     * @return the distance data between the selected locations
     */
    @Override
    public DistanceApiResponse getDistanceData(String selectedLat, String selectedLong, String workLat, String workLong) {
        DistanceApiResponse mockedFilteredObject = new DistanceApiResponse();

        // normal response
        if (selectedLat.equals("42.3540901") && selectedLong.equals("-71.07004020962789") && workLat.equals("42.3556559") && workLong.equals("-71.0521838")){
            System.out.println("FOUND MOCKED DATA");
            ArrayList<String> destinationAddresses = new ArrayList<>();
            destinationAddresses.add("Christian Science Center- Belvidere/ Dalton, Boston, MA 02110, USA");
            mockedFilteredObject.destination_addresses = destinationAddresses;
            ArrayList<String> originAddresses = new ArrayList<>();
            originAddresses.add("Public Garden, Boston, MA 02116, United States");
            mockedFilteredObject.origin_addresses = originAddresses;

            ArrayList<DistanceApiResponse.Row> allRows = new ArrayList<>();
            DistanceApiResponse.Row row = new DistanceApiResponse.Row();
            ArrayList<DistanceApiResponse.Element> allElements = new ArrayList<>();
            DistanceApiResponse.Element element = new DistanceApiResponse.Element();
            allElements.add(element);
            DistanceApiResponse.Distance distance = new DistanceApiResponse.Distance();
            distance.text = "1.3 mi";
            DistanceApiResponse.Duration duration = new DistanceApiResponse.Duration();
            duration.text = "9 mins";
            element.distance = distance;
            element.origin = "42.3540901,-71.07004020962789";
            element.destination = "42.3556559,-71.0521838";
            element.status = "OK";

            row.elements = allElements;
            allRows.add(row);
            mockedFilteredObject.rows.add(row);
            mockedFilteredObject.status = "OK";
        }

        return mockedFilteredObject;
    }
}
