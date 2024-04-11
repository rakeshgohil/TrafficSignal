using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace TrafficSignalAPI.Controllers
{

    public enum TrafficLightState
    {
        Green,
        Yellow,
        Red
    }
    public enum TrafficLightDirection
    {
        North,
        South,
        East,
        West
    }

    public class SignalData
    {
        public int CurrentDuration { get; set; }
        public DateTime LastChanged { get; set; }
        public bool IsNorthGreen { get; set; }
        public bool IsNorthYellow { get; set; }
        public bool IsEastGreen { get; set; }
        public bool IsEastYellow { get; set; }
    }


    [ApiController]
    [Route("[controller]")]
    public class TrafficSignalController : ControllerBase
    {
        private int normalGreenDuration = 20;
        private int peakNorthSouthGreenDuration = 40;
        private int peakEastWestGreenDuration = 10;
        private int yellowDuration = 5;
        //private Dictionary<TrafficLightDirection, TrafficLightState> _lights = new Dictionary<TrafficLightDirection, TrafficLightState>();
        
        [HttpPost]
        public ActionResult<SignalData> GetSignalData(SignalData signalData = null)
        {
            if (signalData == null)
            {
                signalData = new SignalData
                {
                    CurrentDuration = 0,
                    LastChanged = DateTime.Now,
                    IsEastGreen = false,
                    IsEastYellow = false,
                    IsNorthGreen = true,
                    IsNorthYellow = false
                };
            }

            SignalData signalDataResponse = UpdateLightStates(signalData);
            if (signalDataResponse != null)
            {
                return Ok(signalDataResponse);
            }
            return null;
        }

        private bool IsPeakHours()
        {
            return (DateTime.Now.Hour >= 8 && DateTime.Now.Hour < 10) ||
                (DateTime.Now.Hour >= 17 && DateTime.Now.Hour < 19);
        }

        private SignalData UpdateLightStates(SignalData signalData)
        {

            DateTime _lastStateChange = signalData.LastChanged;
            int currentDuration = signalData.CurrentDuration;
            var totalSeconds = (DateTime.Now - _lastStateChange).TotalSeconds;
            bool isNorthGreen = false;
            bool isNorthYellow = false;
            bool isEastGreen = false;
            bool isEastYellow = false;
            if (totalSeconds > currentDuration)
            {
                if (signalData.IsNorthGreen)
                {
                    isNorthGreen = false;
                    isNorthYellow = true;
                    isEastGreen = false;
                    isEastYellow = false;
                    currentDuration = yellowDuration;
                }
                else if (signalData.IsNorthYellow)
                {
                    isNorthGreen = false;
                    isNorthYellow = false;
                    isEastGreen = true;
                    isEastYellow = false;
                    currentDuration = normalGreenDuration;
                    if (IsPeakHours())
                    {
                        currentDuration = peakEastWestGreenDuration;
                    }
                }
                else if (signalData.IsEastGreen)
                {
                    isNorthGreen = false;
                    isNorthYellow = false;
                    isEastGreen = false;
                    isEastYellow = true;
                    currentDuration = yellowDuration;
                }
                else if (signalData.IsEastYellow)
                {
                    isNorthGreen = true;
                    isNorthYellow = false;
                    isEastGreen = false;
                    isEastYellow = false;
                    currentDuration = normalGreenDuration;
                    if (IsPeakHours())
                    {
                        currentDuration = peakNorthSouthGreenDuration;
                    }
                }

                SignalData signalDataResponse = new SignalData
                {
                    CurrentDuration = currentDuration,
                    LastChanged = DateTime.Now,
                    IsNorthGreen = isNorthGreen,
                    IsNorthYellow = isNorthYellow,
                    IsEastGreen = isEastGreen,
                    IsEastYellow = isEastYellow
                };

                return signalDataResponse;
            }
            return null;
        }
    }

}
