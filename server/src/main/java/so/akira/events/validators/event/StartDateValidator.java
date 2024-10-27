package so.akira.events.validators.event;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;
import java.time.ZoneId;

public class StartDateValidator implements ConstraintValidator<ValidStartDate, Integer> {

    @Override
    public void initialize(ValidStartDate constraintAnnotation) {
    }

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }

        long startOfDayTimestamp = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toEpochSecond();
        return value >= startOfDayTimestamp;
    }
}
