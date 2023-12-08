package edu.brown.cs.student.main.DistanceData;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import okio.Buffer;
import edu.brown.cs.student.main.DistanceData.apiKeys.apiKeys;

/** Class abstracting access to the distance API based on given parameters. */
public class DistanceDataSource implements DistanceData {
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
      System.out.println("wrong connectiontype??");
      return null;
    }
//    urlConnection.setRequestMethod("GET");
//    urlConnection.setRequestProperty("Authorization", "prj_live_sk_1372f831005166889c9bf372c3a33e5bbc3ef230");

    HttpURLConnection clientConnection = (HttpURLConnection) urlConnection;
    clientConnection.connect(); // GET
    if (clientConnection.getResponseCode() != 200) {
      System.out.println("connection unsuccessful");
      return null;
    }
    return clientConnection;
  }

  /**
   * Gets relevant data from the distance API.
   *
   * @param selectedLat the latitude of selected location to request information about.
   * @param selectedLong the longitude of selected location to request information about.
   * @param workLat the latitude of user's work address to request information from.
   * @param workLong the longitude of user's work address to request information from.

   * @return the data received from the distance API
   */
  @Override
  public DistanceApiResponse getDistanceData(
      String selectedLat, String selectedLong, String workLat, String workLong) {
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<DistanceApiResponse> distanceAdapter = moshi.adapter(DistanceApiResponse.class);

    if (selectedLat != null && selectedLong != null && workLat != null && workLong != null) { // means that a request is being made for state codes
      URL requestUrl = null;
      try {
        // Construct the Distance API URL with the given parameters
        String apiKey = apiKeys.DISTANCE_API_KEY;
        String apiUrl = "https://api.distancematrix.ai/maps/api/distancematrix/json?origins=" + selectedLat + "," + selectedLong + "&destinations=" + workLat+"," + workLong + "&units=imperial&key=" + apiKey;

        requestUrl = new URL(apiUrl);
//        System.out.println("API URL: "+ requestUrl);

        HttpURLConnection clientConnection = null;
        clientConnection = connect(requestUrl);

        DistanceApiResponse body =
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
