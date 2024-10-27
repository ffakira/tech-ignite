package so.akira.events.validators.event;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import so.akira.events.models.Event;

public class EndDateValidator implements ConstraintValidator<ValidEndDate, Event> {

    @Override
    public void initialize(ValidEndDate constraintAnnotation) {
    }

    @Override
    public boolean isValid(Event event, ConstraintValidatorContext context) {
        if (event == null) {
            return true; // Skip validation if the object is null
        }
        return event.getEndDate() > event.getStartDate();
    }
}
