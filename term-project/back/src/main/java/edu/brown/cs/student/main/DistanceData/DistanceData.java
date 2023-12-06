package edu.brown.cs.student.main.DistanceData;

public interface DistanceData {
    /**
     * Gets relevant data from the distance API.
     *
     * @param selectedLat the latitude of selected location to request information about.
     * @param selectedLong the longitude of selected location to request information about.
     * @param workLat the latitude of user's work address to request information from.
     * @param workLong the longitude of user's work address to request information from.

     * @return the data received from the distance API
     */
    DistanceApiResponse getDistanceData(String selectedLat, String selectedLong, String workLat, String workLong);
}
