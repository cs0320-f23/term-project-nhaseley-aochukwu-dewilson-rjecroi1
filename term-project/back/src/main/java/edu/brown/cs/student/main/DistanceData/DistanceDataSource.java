package edu.brown.cs.student.main.DistanceData;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import okio.Buffer;

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
    urlConnection.setRequestProperty("Authorization", "prj_live_sk_1372f831005166889c9bf372c3a33e5bbc3ef230");

    HttpURLConnection clientConnection = (HttpURLConnection) urlConnection;
    clientConnection.connect(); // GET
    if (clientConnection.getResponseCode() != 200) {
      System.out.println("connection unsuccessful");
      return null;
    }
    return clientConnection;
  }
//   private static HttpURLConnection connect(URL requestUrl) throws IOException {
//     HttpURLConnection urlConnection = (HttpURLConnection) requestUrl.openConnection();
//     urlConnection.setRequestMethod("GET");
  // TODO: HIDE API KEY
//     urlConnection.setRequestProperty("Authorization", "prj_live_sk_1372f831005166889c9bf372c3a33e5bbc3ef230");


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
  public List<List<String>> getDistanceData(
      String selectedLat, String selectedLong, String workLat, String workLong) {
    Moshi moshi = new Moshi.Builder().build();
    Type listListString = Types.newParameterizedType(List.class, List.class, String.class);
    JsonAdapter<List<List<String>>> listAdapter = moshi.adapter(listListString);

    if (selectedLat != null && selectedLong != null && workLat != null && workLong != null) { // means that a request is being made for state codes
      URL requestUrl = null;
      try {
        System.out.println("SENDING..." + selectedLat + " " + selectedLong + " " + workLat + " " + workLong);
        // requestUrl = new URL("https", "api.census.gov", "");
        // Construct the Radar API URL with the given parameters
        String apiUrl = String.format("https://api.radar.io/v1/route/distance?origin=%f,%f&destination=%f,%f&modes=foot,car&units=imperial"
        , selectedLat, selectedLong, workLat, workLong
        );
        System.out.println("API URL: "+ apiUrl);
        requestUrl = new URL(apiUrl);

        HttpURLConnection clientConnection = null;
        clientConnection = connect(requestUrl);

        List<List<String>> body =
            listAdapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
        System.out.println("RESULT: " + body);
        clientConnection.disconnect();
        if (Objects.equals(body, new ArrayList<>())) {
          return null;
        }
        return body;
      } catch (Exception e) {
        e.printStackTrace();
        System.out.println("erorr: "+ e);
        return null;
      }


        // code from maps:
        // } else if (stateNumber
        //     != null) { // && countyNumber != null    //means user wants broadband data
        // URL requestUrl = null;
        // try {
        //     requestUrl =
        //         new URL(
        //             "https",
        //             "api.census.gov",
        //             "/data/2021/acs/acs1/subject/variables?get=NAME,S2802_C03_022E&for=county:"
        //                 + countyNumber
        //                 + "&in=state:"
        //                 + stateNumber);

        //     HttpURLConnection clientConnection = null;
        //     clientConnection = connect(requestUrl);

        //     // NOTE: important! pattern for handling the input stream
        //     List<List<String>> body =
        //         listAdapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
        //     clientConnection.disconnect();
        //     if (Objects.equals(body, new ArrayList<>())) {
        //     return null;
        //     }
        //     return body;


    } else { // means parameters were malformed
      return null;
    }
  }
}
