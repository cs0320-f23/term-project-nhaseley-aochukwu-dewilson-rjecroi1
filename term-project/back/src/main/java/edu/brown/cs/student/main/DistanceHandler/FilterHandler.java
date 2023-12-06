package edu.brown.cs.student.main.DistanceHandler;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.DistanceData.DistanceApiResponse;
import edu.brown.cs.student.main.DistanceData.DistanceData;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/** Class for the handling of the filter by distance route. */
public class FilterHandler implements Route {

  DistanceData dist;

  /** constructor for FilterHandler. Assigns state as dependency injected FilterData. */
  public FilterHandler(DistanceData distancedata) {
    this.dist = distancedata;
  }

  /**
   * Handler method for filter. Requests information from distance API to get the distance between selected location and user's work address
   * codes and then uses those to request broadband information from the distance API.
   *
   * @param request takes in request as input
   * @param response takes in response as input Note: for the purposes of this server we ignore these
   * @return map response
   */
  @Override
  public Object handle(Request request, Response response) {
    Moshi moshi = new Moshi.Builder().build();
    Type mapStringObject = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> mapAdapter = moshi.adapter(mapStringObject);
    Map<String, Object> responseMap = new HashMap<>();

    try {
      String selectedLat;
      if (request.queryParams("selectedLat") == null) {
        responseMap.put("result", "error_bad_request");
        responseMap.put("missing", "selectedLat query parameter");
        return mapAdapter.toJson(responseMap);
      } else {
        selectedLat = request.queryParams("selectedLat");
      }

      String selectedLong;
      if (request.queryParams("selectedLong") == null) {
        responseMap.put("result", "error_bad_request");
        responseMap.put("missing", "selectedLong query parameter");
        return mapAdapter.toJson(responseMap);
      } else {
        selectedLong = request.queryParams("selectedLong");
      }
      String workLat;
      if (request.queryParams("workLat") == null) {
        responseMap.put("result", "error_bad_request");
        responseMap.put("missing", "workLat query parameter");
        return mapAdapter.toJson(responseMap);
      } else {
        workLat = request.queryParams("workLat");
      }
      String workLong;
      if (request.queryParams("workLong") == null) {
        responseMap.put("result", "error_bad_request");
        responseMap.put("missing", "workLong query parameter");
        return mapAdapter.toJson(responseMap);
      } else {
        workLong = request.queryParams("workLong");
      }

      responseMap.put("selectedLat", selectedLat);
      responseMap.put("selectedLong", selectedLong);
      responseMap.put("workLat", workLat);
      responseMap.put("workLong", workLong);


      DistanceApiResponse res = this.dist.getDistanceData(
              selectedLat,
              selectedLong,
              workLat,
              workLong);

      responseMap.put("status", res.status);
      if (res != null && "OK".equals(res.status)) {
        // Process the parsed data, e.g., print the duration and distance
        for (DistanceApiResponse.Row row : res.rows) {
          for (DistanceApiResponse.Element element : row.elements) {
            responseMap.put("origin", element.origin);
            responseMap.put("destination", element.destination);
            if (element.distance != null) {
              responseMap.put("distance", element.distance.text);
            }
            if (element.duration != null) {
              responseMap.put("duration", element.duration.text);
            }
            if (element.status != "OK"){
              responseMap.put("status", element.status);
              if (element.status.equals("NOT FOUND")) {
                responseMap.put("error", "Origin and/or destination of this pairing could not be geocoded.");
              } else if (element.status.equals("ZERO_RESULTS")){
                responseMap.put("error", "No route could be found between the origin and destination.");
              } else if (element.status.equals("MAX_ROUTE_LENGTH_EXCEEDED")){
                responseMap.put("error", "requested route is too long and cannot be processed.");
              } else {
                responseMap.put("error", element.status);
              }
            }
          }
        }
      } else {
        responseMap.put("error", "Call to DistanceAPI failure. Please check inputs again.");
      }
      return mapAdapter.toJson(responseMap);
    } catch (Exception e){
      e.printStackTrace();
      System.out.println("error in filtering: " + e);
      responseMap.put("error", e.toString());
      return mapAdapter.toJson(responseMap);
    }
  }
}