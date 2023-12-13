package edu.brown.cs.student.main.DistanceHandler;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.CoordinateData.CoordinateApiResponse;
import edu.brown.cs.student.main.CoordinateData.CoordinateData;
import edu.brown.cs.student.main.DistanceData.DistanceApiResponse;
import edu.brown.cs.student.main.DistanceData.DistanceData;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/** Class for the handling of the filter by distance route. */
public class FilterHandler implements Route {

  DistanceData dist;
  CoordinateData coord;

  /** constructor for FilterHandler. Assigns state as dependency injected FilterData. */
  public FilterHandler(DistanceData distancedata, CoordinateData coordinatedata) {
    this.dist = distancedata;
    this.coord = coordinatedata;
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
      String address;
      String workAddress;
      String selectedLat = null;
      String selectedLong = null;
      String workLat = null;
      String workLong = null; // TODO: change to empty string?
      if (request.queryParams("address") == null || request.queryParams("address").equals("")) {
        responseMap.put("result", "error_bad_request");
        responseMap.put("missing", "selected address query parameter");
        responseMap.put("error", "Invalid request: missing selected address query parameter");
        return mapAdapter.toJson(responseMap);
      } else {
        address = request.queryParams("address");
      }

      // Convert address to coordinates in order to use distance API
      CoordinateApiResponse conversionRes = this.coord.getCoordinateData(address);
      if (conversionRes != null) {
        System.out.println("CONVERSION RES status: " + conversionRes.status);
        if (conversionRes.status != null) {
          if (conversionRes.status.equals("OK")) {
            for (CoordinateApiResponse.Result res : conversionRes.result) {
              if (res.formatted_address != null) {
                responseMap.put("formatted_address", res.formatted_address);
              }
              if (res.geometry != null) {
                if (res.geometry.location != null) {
                  selectedLat = Double.toString(res.geometry.location.lat);
                  responseMap.put("converted_selected_latitude", res.geometry.location.lat);
                  selectedLong = Double.toString(res.geometry.location.lng);
                  responseMap.put("converted_selected_longitude", res.geometry.location.lng);
                }
              }

            }
          } else if (conversionRes.status.equals("ZERO_RESULTS")) {
            responseMap.put("error", "GeoCodeAPI failure for selected address: The geocode was successful but returned no results. This may occur if the geocoder was passed a non-existent address.");
            return mapAdapter.toJson(responseMap); // don't call to the DistanceAPI
          } else if (conversionRes.status.equals("OVER_DAILY_LIMIT")) {
            responseMap.put("error", "GeoCodeAPI failure for selected address, either:\n" +
                    "The API key is missing or invalid.\n" +
                    "\n" +
                    "Billing has not been enabled on your account.\n" +
                    "\n" +
                    "A self-imposed usage cap has been exceeded.");
            return mapAdapter.toJson(responseMap);
          } else if (conversionRes.status.equals("OVER_QUERY_LIMIT")) {
            responseMap.put("error", "GeoCodeAPI failure for selected address: You are over your quota.");
            return mapAdapter.toJson(responseMap);
          } else if (conversionRes.status.equals("REQUEST_DENIED")) {
            responseMap.put("error", "GeoCodeAPI failure for selected address: Your request was denied.");
            return mapAdapter.toJson(responseMap);
          } else if (conversionRes.status.equals("INVALID_REQUEST")) {
            responseMap.put("error", "GeoCodeAPI failure for selected address: The query (address, components or latlng) is missing.");
            return mapAdapter.toJson(responseMap);
          } else if (conversionRes.status.equals("UNKNOWN_ERROR")) {
            responseMap.put("error", "GeoCodeAPI failure for selected address: The request could not be processed due to a server error. The request may succeed if you try again.");
            return mapAdapter.toJson(responseMap);
          } else if (conversionRes.error_message != null) {
            responseMap.put("error", conversionRes.error_message);
            return mapAdapter.toJson(responseMap);
          } else {
            responseMap.put("error", "Call to GeoCodeAPI failure for selected address: " + conversionRes.status);
            return mapAdapter.toJson(responseMap);
          }
        } else {
          responseMap.put("error", "Call to GeoCodeAPI failure for selected address. No status field found");
          return mapAdapter.toJson(responseMap);
        }
      } else {
        responseMap.put("error", "Call to GeoCodeAPI failure for selected address. Please check inputs again.");
        return mapAdapter.toJson(responseMap);
      }

      if (request.queryParams("workAddress") == null || request.queryParams("workAddress").equals("")) {
        responseMap.put("result", "error_bad_request");
        responseMap.put("missing", "work address query parameter");
        responseMap.put("error", "Invalid request: missing work address query parameter");
        return mapAdapter.toJson(responseMap);
      } else {
        workAddress = request.queryParams("workAddress");
      }

      // Convert work address to coordinates in order to use distance API
      CoordinateApiResponse workConversionRes = this.coord.getCoordinateData(workAddress);
      if (workConversionRes != null) {
        if (workConversionRes.status != null) {
          if ("OK".equals(workConversionRes.status)) {

            for (CoordinateApiResponse.Result res : workConversionRes.result) {
              if (res.formatted_address != null) {
                responseMap.put("formatted_work_address", res.formatted_address);
              }
              if (res.geometry != null) {
                if (res.geometry.location != null) {
                  workLat = Double.toString(res.geometry.location.lat);
                  responseMap.put("converted_work_latitude", res.geometry.location.lat);
                  workLong = Double.toString(res.geometry.location.lng);
                  responseMap.put("converted_work_longitude", res.geometry.location.lng);
                }
              }

            }
          } else if (workConversionRes.status.equals("ZERO_RESULTS")) {
            responseMap.put("error", "GeoCodeAPI failure for work address: The geocode was successful but returned no results. This may occur if the geocoder was passed a non-existent address.");
            return mapAdapter.toJson(responseMap); // don't call to the DistanceAPI
          } else if (workConversionRes.status.equals("OVER_DAILY_LIMIT")) {
            responseMap.put("error", "GeoCodeAPI failure for work address, either:\n" +
                    "The API key is missing or invalid.\n" +
                    "\n" +
                    "Billing has not been enabled on your account.\n" +
                    "\n" +
                    "A self-imposed usage cap has been exceeded.");
            return mapAdapter.toJson(responseMap);
          } else if (workConversionRes.status.equals("OVER_QUERY_LIMIT")) {
            responseMap.put("error", "GeoCodeAPI failure for work address: You are over your quota.");
            return mapAdapter.toJson(responseMap);
          } else if (workConversionRes.status.equals("REQUEST_DENIED")) {
            responseMap.put("error", "GeoCodeAPI failure for work address: Your request was denied.");
            return mapAdapter.toJson(responseMap);
          } else if (workConversionRes.status.equals("INVALID_REQUEST")) {
            responseMap.put("error", "GeoCodeAPI failure for work address: The query (address, components or latlng) is missing.");
            return mapAdapter.toJson(responseMap);
          } else if (workConversionRes.status.equals("UNKNOWN_ERROR")) {
            responseMap.put("error", "GeoCodeAPI failure for work address: The request could not be processed due to a server error. The request may succeed if you try again.");
            return mapAdapter.toJson(responseMap);
          } else if (workConversionRes.error_message != null) {
            responseMap.put("error", "Call to GeoCodeAPI failure for work address: " + workConversionRes.error_message);
            return mapAdapter.toJson(responseMap);
          } else {
            responseMap.put("error", workConversionRes.status + ": Call to GeoCodeAPI failure for work address. Please check inputs again.");
            return mapAdapter.toJson(responseMap);
          }
        } else {
          responseMap.put("error", "Call to GeoCodeAPI failure for work address. No status field found");
          return mapAdapter.toJson(responseMap);
        }
      } else {
        responseMap.put("error", "Call to GeoCodeAPI failure for work address. Please check inputs again.");
        return mapAdapter.toJson(responseMap);
      }

      DistanceApiResponse res = this.dist.getDistanceData(
              selectedLat,
              selectedLong,
              workLat,
              workLong);

      if (res != null) {
//        if (res.status 1)
        responseMap.put("status", res.status);
        if ("OK".equals(res.status)) {
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
              if (!element.status.equals("OK")) {
                responseMap.put("status", element.status);
                if (element.status.equals("NOT FOUND")) {
                  responseMap.put("error", "Origin and/or destination of this pairing could not be geocoded.");
                } else if (element.status.equals("ZERO_RESULTS")) {
                  responseMap.put("error", "No route could be found between the origin and destination.");
                } else if (element.status.equals("MAX_ROUTE_LENGTH_EXCEEDED")) {
                  responseMap.put("error", "requested route is too long and cannot be processed.");
                } else {
                  responseMap.put("error", element.status);
                }
              }
            }
          }
        } else if (res.status.equals("INVALID_REQUEST")){
          responseMap.put("error", "Provided DistanceAPI request was invalid.");
        } else if (res.status.equals("MAX_ELEMENTS_EXCEEDED")){
          responseMap.put("error", "DistanceAPI failure: Product of origin and destination exceeds the per-query limit.");
        } else if (res.status.equals("OVER_DAILY_LIMIT")){
          responseMap.put("error", "DistanceAPI failure, either:\n" +
                  "The API key is missing or invalid.\n" +
                  "\n" +
                  "Billing has not been enabled on your account.\n" +
                  "\n" +
                  "A self-imposed usage cap has been exceeded.\n" +
                  "\n" +
                  "The provided method of payment is no longer valid (for example, a credit card has expired).");
        } else if (res.status.equals("OVER_QUERY_LIMIT")){
          responseMap.put("error", "DistanceAPI failure: The service has received too many requests from your application within the allowed time period.");
        } else if (res.status.equals("REQUEST_DENIED")){
          responseMap.put("error", "DistanceAPI failure: The service denied the use of the Distance Matrix service by your application.");
        } else if (res.status.equals("UNKNOWN_ERROR")){
          responseMap.put("error", "Distance Matrix request could not be processed due to a server error. The request may succeed if you try again.");
        } else {
          responseMap.put("error", res.status);
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