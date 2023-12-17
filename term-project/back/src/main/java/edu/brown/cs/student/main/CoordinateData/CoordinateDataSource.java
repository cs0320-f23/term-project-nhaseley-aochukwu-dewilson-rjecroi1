package edu.brown.cs.student.main.CoordinateData;

import edu.brown.cs.student.main.DistanceData.apiKeys.apiKeys;
import okio.Buffer;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
public class CoordinateDataSource implements CoordinateData {

/** Class abstracting access to the distance API based on given parameters. */
    /**
     * Function to allow for a connection to a URL.
     *
     * @param requestUrl the URL being requested
     * @return a connection to the URL
     * @throws IOException if there is an error making the connection
     */
    private static HttpURLConnection connect(URL requestUrl) throws IOException {
        URLConnection urlConnection = requestUrl.openConnection();
        if (!(urlConnection instanceof HttpURLConnection)) {
            System.out.println("Wrong connection type for coordinate API");
            return null;
        }

        HttpURLConnection clientConnection = (HttpURLConnection) urlConnection;
        clientConnection.connect(); // GET
        if (clientConnection.getResponseCode() != 200) {
            System.out.println("Connection unsuccessful for coordinate API");
            return null;
        }
        return clientConnection;
    }

    /**
     * Gets relevant data from the address to coordinate conversion API.
     *
     * @param address the address of selected location to request information about.

     * @return the data received from the address to coordinate conversion API
     */
    @Override
    public CoordinateApiResponse getCoordinateData(
            String address) {
        Moshi moshi = new Moshi.Builder().build();
        JsonAdapter<CoordinateApiResponse> distanceAdapter = moshi.adapter(CoordinateApiResponse.class);
//        System.out.println("address to convert: " + address);
        if (address != null) {
            URL requestUrl = null;
            try {
                // Construct the Address-Coordinate Conversion API URL with the given address
                String apiKey = apiKeys.CONVERSION_API_KEY;
                String apiUrl = "https://api.distancematrix.ai/maps/api/geocode/json?address=" + address + "&key=" + apiKey;
                requestUrl = new URL(apiUrl);
//                System.out.println("API URL: "+ requestUrl);

                HttpURLConnection clientConnection = null;
                clientConnection = connect(requestUrl);
                if (clientConnection == null){
                    return null;
                }
                CoordinateApiResponse body =
                        distanceAdapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));

                clientConnection.disconnect();

                return body;

            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("error: "+ e);
                return null;
            }

        } else { // means parameters were malformed
            System.out.println("error: malformed parameters");
            return null;
        }
    }
}
