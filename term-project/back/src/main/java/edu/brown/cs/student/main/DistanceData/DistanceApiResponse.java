package edu.brown.cs.student.main.DistanceData;

import java.util.List;

/** Class representing a distance response for Moshi to use. */
public class DistanceApiResponse {
    public List<String> destination_addresses;
    public List<String> origin_addresses;
    public List<Row> rows;
    public String status;

    public static class Row {
        public List<Element> elements;
    }

    public static class Element {
        public Distance distance;
        public Duration duration;
        public String origin;
        public String destination;
        public String status;
    }

    public static class Distance {
        public String text;
        public int value;
    }

    public static class Duration {
        public String text;
        public int value;
    }
}