package edu.brown.cs.student.main;
import static spark.Spark.after;

// import com.google.gson.JsonArray;
// import com.squareup.moshi.JsonAdapter;
// import com.squareup.moshi.Moshi;
// import com.squareup.moshi.Types;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.CoordinateData.CoordinateData;
import edu.brown.cs.student.main.CoordinateData.CoordinateDataSource;
import edu.brown.cs.student.main.DistanceData.DistanceData;
import edu.brown.cs.student.main.DistanceData.DistanceDataSource;
import edu.brown.cs.student.main.DistanceHandler.FilterHandler;

import spark.Spark;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

/** The class representing the server. */
public class Server {

  // spark port for the server
  static final int port = 4500;

  // dependency injected DistanceData state
  private final DistanceData dist;
  private final CoordinateData coord;

        /**
         * Constructor for the server, starting it with Spark Java.
         *
         * @param toUseDist the DistanceData to dependency inject into the distance filter handler.
         * @param toUseCoord the CoordinateData to dependency inject into the distance filter handler.
         */
        public Server(DistanceData toUseDist, CoordinateData toUseCoord) {
            // Use whatever was dependency-injected into this constructor
            this.dist = toUseDist;
            this.coord = toUseCoord;

            // Set up our SparkJava server:
            Spark.port(port);
            after(
                    (request, response) -> {
                        response.header("Access-Control-Allow-Origin", "*");
                        response.header("Access-Control-Allow-Methods", "*");
                    });

            // listen on filter endpoints
            Spark.get("/filter", new FilterHandler(this.dist, this.coord));

            // moshi building
            Moshi moshi = new Moshi.Builder().build();
            Type mapStringObject = Types.newParameterizedType(Map.class, String.class, Object.class);
            JsonAdapter<Map<String, Object>> mapAdapter = moshi.adapter(mapStringObject);
            Map<String, Object> responseMap = new HashMap<>();

            // error handling for no endpoint provided or incorrect endpoint
            Spark.get(
                    "/",
                    (req, res) -> {
                        responseMap.put("result", "failure");
                        responseMap.put("endpoint must be", "filter");
                        responseMap.put("issue", "no endpoint provided");

                        return mapAdapter.toJson(responseMap);
                    });
            Spark.get(
                    "*",
                    (req, res) -> {
                        responseMap.put("result", "failure");
                        responseMap.put("endpoint must be", "filter");
                        responseMap.put("issue", "improper endpoint");

                        return mapAdapter.toJson(responseMap);
                    });

            // Wait until the server has started.
            Spark.awaitInitialization();
            System.out.println("Server started at http://localhost:" + port);
        }

        /**
         * Main method that starts the server.
         *
         * @param args command line arguments. Not used in this server.
         */
        public static void main(String[] args) {
            // At time of creation, we decide on a specific CensusData class:
            edu.brown.cs.student.main.Server server =
                    new edu.brown.cs.student.main.Server(new DistanceDataSource(), new CoordinateDataSource());
        }

}
