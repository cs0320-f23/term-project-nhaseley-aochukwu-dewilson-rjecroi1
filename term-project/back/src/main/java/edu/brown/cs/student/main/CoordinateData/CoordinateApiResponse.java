package edu.brown.cs.student.main.CoordinateData;
import java.util.List;
import org.jetbrains.annotations.Nullable;

public class CoordinateApiResponse {

    public List<Result> result;
    public String status;
    @Nullable // Per GeoCodeAPI documentation, this field is not guaranteed to be always present, and its content is subject to change.
    public String error_message;

    public static class Result {
        public List<AddressComponent> address_components;
        public String formatted_address;
        public Geometry geometry;
        public String place_id;
        public PlusCode plus_code;
        public List<String> types;
    }

    public static class AddressComponent {
        public String long_name;
        public String short_name;
        public List<String> types;
    }

    public static class Geometry {
        public Location location;
        public String location_type;
        public Viewport viewport;
    }

    public static class Location {
        public double lat;
        public double lng;
    }

    public static class Viewport {
        public Location northeast;
        public Location southwest;
    }

    public static class PlusCode {
        // Define PlusCode fields if needed
    }
}
