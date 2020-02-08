'use strict';

(function () {

  window.translateElement = function (element, callbacks) {
    element.addEventListener('mousedown', function onMouseDown(evt) {
      evt.preventDefault();

      // Координаты курсора в момент клика относительно окна, для событий мыши.
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      callbacks.onDragStart(startCoords.x, startCoords.y);

      var dragged = false;

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();
        dragged = true;

        // Расстояние на которое двигается курсор от начального положения (где он был по щелчку) до опускания кнопки мышки
        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        var top = element.offsetTop - shift.y;
        var left = element.offsetLeft - shift.x;

        if (top < 130 - window.MAP_PIN_HEIGHT) {
          element.style.top = 130 - window.MAP_PIN_HEIGHT;
        } else if (top > 630 - window.MAP_PIN_HEIGHT) {
          element.style.top = 630 - window.MAP_PIN_HEIGHT;
        } else {
          element.style.top = top + 'px';
        }
        
        element.style.left = left + 'px';
        callbacks.onDragMove(top, left);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (dragged) {
          var onClickPreventDefault = function (clickEvt) {
            clickEvt.preventDefault();
          };
          element.addEventListener('click', onClickPreventDefault);
        }

        callbacks.onDragEnd(upEvt.clientX, upEvt.clientY);
      };

      // Обработчики события передвижения мыши и отпускания кнопки мыши
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };
})();
