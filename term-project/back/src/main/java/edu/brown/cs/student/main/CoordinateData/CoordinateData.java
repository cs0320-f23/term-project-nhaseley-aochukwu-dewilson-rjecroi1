package edu.brown.cs.student.main.CoordinateData;

import edu.brown.cs.student.main.CoordinateData.CoordinateApiResponse;
import java.util.List;

public interface CoordinateData {
    /**
     * Gets relevant data from the address to coordinate conversion API.
     *
     * @param address the address of selected location to request information about.

     * @return the data received from the address to coordinate conversion API
     */
    CoordinateApiResponse getCoordinateData(String address);
}
