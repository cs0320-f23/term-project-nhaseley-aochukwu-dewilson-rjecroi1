package edu.brown.cs.student.main.DistanceHandler;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
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
    try {
      Moshi moshi = new Moshi.Builder().build();
      Type mapStringObject = Types.newParameterizedType(Map.class, String.class, String.class);
      JsonAdapter<Map<String, String>> mapAdapter = moshi.adapter(mapStringObject);
      Map<String, String> responseMap = new HashMap<>();


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


      List<List<String>> ans = this.dist.getDistanceData(
              selectedLat,
              selectedLong,
              workLat,
              workLong);
      System.out.println("from api call: " + ans);
      return mapAdapter.toJson(responseMap);
    } catch (Exception e){
      e.printStackTrace();
      System.out.println("error in filtering: " + e);
      throw e;
//      responseMap.put("exception", e.toString());
//      return mapAdapter.toJson(responseMap);
    }
  }
}