package main;
import static spark.Spark.after;

// import com.google.gson.JsonArray;
// import com.squareup.moshi.JsonAdapter;
// import com.squareup.moshi.Moshi;
// import com.squareup.moshi.Types;
import spark.Spark;

/** The class representing the server. */
public class Server {

  // spark port for the server
  static final int port = 4500;

  /**
   * Main method that starts the server.
   *
   * @param args command line arguments. Not used in this server.
   */
  public static void main(String[] args) {
    System.out.println("starting up server...");
    // At time of creation, we decide on a specific CensusData class:
    Spark.port(port);
    after(
            (request, response) -> {
              response.header("Access-Control-Allow-Origin", "*");
              response.header("Access-Control-Allow-Methods", "*");
            });
    Spark.awaitInitialization();
  }
}
